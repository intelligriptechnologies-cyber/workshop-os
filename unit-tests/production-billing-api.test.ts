import assert from "node:assert/strict";
import test from "node:test";
import { createBillingPdf,validateDeliveryEvidence,validateMoney } from "../production/src/billing-delivery.js";

test("billing documents are valid private-ready PDFs with stable checksums",()=>{const value=createBillingPdf("INVOICE","INV/2026/1",["Job 42","Payable INR 10000"]);assert.equal(value.mimeType,"application/pdf");assert.equal(value.content.subarray(0,8).toString(),"%PDF-1.4");assert.match(value.checksum,/^[0-9a-f]{64}$/);assert.ok(value.content.byteLength>500);});
test("billing input guards require positive money and complete delivery acknowledgement",()=>{assert.equal(validateMoney("100"),true);assert.equal(validateMoney("0"),false);assert.equal(validateMoney("1.5"),false);assert.equal(validateDeliveryEvidence({finalOdometerKm:1,deliveredToName:"Asha",identityType:"OTHER",identityLast4:"1234",acknowledgement:"Accepted"}),true);assert.equal(validateDeliveryEvidence({finalOdometerKm:-1,deliveredToName:"",identityType:"",identityLast4:"1",acknowledgement:""}),false);});
