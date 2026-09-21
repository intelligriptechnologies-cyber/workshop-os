import { createHash, randomBytes } from "node:crypto";

import {
  AdminCreateUserCommand,
  AdminDisableUserCommand,
  AdminEnableUserCommand,
  AdminGetUserCommand,
  CognitoIdentityProviderClient,
  type AttributeType,
} from "@aws-sdk/client-cognito-identity-provider";
import { CognitoJwtVerifier } from "aws-jwt-verify";

import { ApiError, type CognitoAdminPort, type MembershipStatus } from "../src/admin-users.js";

const attribute = (attributes: AttributeType[] | undefined, name: string) =>
  attributes?.find((item) => item.Name === name)?.Value;

const membershipStatus = (cognitoStatus: string | undefined): MembershipStatus =>
  cognitoStatus === "FORCE_CHANGE_PASSWORD" || cognitoStatus === "RESET_REQUIRED" ? "INVITED" : "ACTIVE";

export class CognitoGateway implements CognitoAdminPort {
  private readonly client: CognitoIdentityProviderClient;
  private readonly verifier;

  constructor(
    private readonly userPoolId: string,
    private readonly clientId: string,
    region: string,
  ) {
    this.client = new CognitoIdentityProviderClient({ region });
    this.verifier = CognitoJwtVerifier.create({ userPoolId, clientId, tokenUse: "access" });
  }

  async verifyAccessToken(token: string): Promise<string> {
    try {
      const payload = await this.verifier.verify(token);
      if (!payload.sub) throw new Error("missing subject");
      return payload.sub;
    } catch {
      throw new ApiError(401, "TOKEN_INVALID");
    }
  }

  async verifyPlatformAccessToken(token: string): Promise<{ subject:string; authenticatedAt:string; mfa:boolean }> {
    try {
      const payload = await this.verifier.verify(token);
      if (!payload.sub || typeof payload.auth_time !== "number") throw new Error("missing platform authentication claims");
      const methods=Array.isArray(payload.amr)?payload.amr.map(String):[];
      return {subject:payload.sub,authenticatedAt:new Date(payload.auth_time*1000).toISOString(),mfa:methods.some(value=>["mfa","sms_mfa","software_token_mfa"].includes(value.toLowerCase()))};
    } catch {
      throw new ApiError(401, "PLATFORM_TOKEN_INVALID");
    }
  }

  async ensureUser(input: { email: string; name: string; tenantId: string }) {
    const existing = await this.getUser(input.email);
    if (existing) {
      if (attribute(existing.UserAttributes, "custom:tenant_id") !== input.tenantId) {
        throw new ApiError(409, "EMAIL_EXISTS");
      }
      const subject = attribute(existing.UserAttributes, "sub");
      if (!subject || !existing.Username) throw new ApiError(502, "IDENTITY_PROVIDER_ERROR");
      return { identitySubject: subject, username: existing.Username, status: membershipStatus(existing.UserStatus) };
    }

    try {
      const created = await this.client.send(new AdminCreateUserCommand({
        UserPoolId: this.userPoolId,
        Username: input.email,
        DesiredDeliveryMediums: ["EMAIL"],
        TemporaryPassword: `Wo1!${randomBytes(18).toString("base64url")}`,
        UserAttributes: [
          { Name: "email", Value: input.email },
          { Name: "email_verified", Value: "true" },
          { Name: "name", Value: input.name },
          { Name: "custom:tenant_id", Value: input.tenantId },
        ],
      }));
      const subject = attribute(created.User?.Attributes, "sub");
      if (!subject || !created.User?.Username) throw new ApiError(502, "IDENTITY_PROVIDER_ERROR");
      return { identitySubject: subject, username: created.User.Username, status: membershipStatus(created.User.UserStatus) };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if ((error as { name?: string }).name === "UsernameExistsException") {
        const recovered = await this.getUser(input.email);
        const subject = attribute(recovered?.UserAttributes, "sub");
        if (recovered?.Username && subject && attribute(recovered.UserAttributes, "custom:tenant_id") === input.tenantId) {
          return { identitySubject: subject, username: recovered.Username, status: membershipStatus(recovered.UserStatus) };
        }
        throw new ApiError(409, "EMAIL_EXISTS");
      }
      throw new ApiError(502, "IDENTITY_PROVIDER_ERROR");
    }
  }

  async disableUser(username: string) {
    try {
      await this.client.send(new AdminDisableUserCommand({ UserPoolId: this.userPoolId, Username: username }));
    } catch {
      throw new ApiError(502, "IDENTITY_PROVIDER_ERROR");
    }
  }

  async enableUser(username: string) {
    try {
      await this.client.send(new AdminEnableUserCommand({ UserPoolId: this.userPoolId, Username: username }));
    } catch {
      throw new ApiError(502, "IDENTITY_PROVIDER_ERROR");
    }
  }

  async resendInvitation(username: string) {
    try {
      await this.client.send(new AdminCreateUserCommand({
        UserPoolId: this.userPoolId,
        Username: username,
        MessageAction: "RESEND",
        DesiredDeliveryMediums: ["EMAIL"],
      }));
    } catch {
      throw new ApiError(502, "IDENTITY_PROVIDER_ERROR");
    }
  }

  private async getUser(username: string) {
    try {
      return await this.client.send(new AdminGetUserCommand({ UserPoolId: this.userPoolId, Username: username }));
    } catch (error) {
      if ((error as { name?: string }).name === "UserNotFoundException") return undefined;
      throw new ApiError(502, "IDENTITY_PROVIDER_ERROR");
    }
  }
}

export class LocalIdentityGateway implements CognitoAdminPort {
  async ensureUser(input: { email: string }) {
    const identitySubject = `local-${createHash("sha256").update(input.email).digest("hex")}`;
    return { identitySubject, username: input.email, status: "INVITED" as const };
  }

  async disableUser() {}
  async enableUser() {}
  async resendInvitation() {}
}
