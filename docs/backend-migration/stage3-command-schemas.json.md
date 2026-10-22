[
  {
    "operation": "OP-admin-demo-state-addDemoRole",
    "route": "POST /api/v1/ui/commands/addDemoRole",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "$ref": "#/$defs/D2"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "label": {
            "type": "string"
          },
          "description": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "pageAccess": {
            "anyOf": [
              {
                "type": "array",
                "items": {
                  "anyOf": [
                    {
                      "const": "receive-vehicle"
                    },
                    {
                      "const": "advance-bookings"
                    },
                    {
                      "const": "today-queue"
                    },
                    {
                      "const": "customers"
                    },
                    {
                      "const": "vehicles"
                    },
                    {
                      "const": "search"
                    },
                    {
                      "const": "my-queue"
                    },
                    {
                      "const": "job-card"
                    },
                    {
                      "const": "estimate"
                    },
                    {
                      "const": "follow-ups"
                    },
                    {
                      "const": "media"
                    },
                    {
                      "const": "material-requests"
                    },
                    {
                      "const": "issue-material"
                    },
                    {
                      "const": "reconcile"
                    },
                    {
                      "const": "stock"
                    },
                    {
                      "const": "approvals"
                    },
                    {
                      "const": "inward-purchases"
                    },
                    {
                      "const": "my-tasks"
                    },
                    {
                      "const": "work-update"
                    },
                    {
                      "const": "qc-prep"
                    },
                    {
                      "const": "ready-to-invoice"
                    },
                    {
                      "const": "invoice"
                    },
                    {
                      "const": "payment"
                    },
                    {
                      "const": "delivery"
                    },
                    {
                      "const": "dashboard"
                    },
                    {
                      "const": "data-flow"
                    },
                    {
                      "const": "jobs"
                    },
                    {
                      "const": "manage"
                    },
                    {
                      "const": "admin-console"
                    },
                    {
                      "const": "sales-leads"
                    },
                    {
                      "const": "quotations"
                    },
                    {
                      "const": "quotation-settings"
                    }
                  ]
                }
              }
            ]
          }
        },
        "required": [
          "label"
        ],
        "additionalProperties": false
      },
      "D2": {
        "type": "object",
        "properties": {
          "version": {
            "const": 2
          },
          "roles": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D3"
            }
          },
          "rolePageAccess": {
            "$ref": "#/$defs/D4"
          },
          "businessSettings": {
            "$ref": "#/$defs/D5"
          },
          "appTheme": {
            "$ref": "#/$defs/D14"
          },
          "logs": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D15"
            }
          },
          "importBatches": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D17"
            }
          },
          "sessionInventory": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D20"
            }
          },
          "reportTemplates": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D21"
            }
          },
          "companyAssets": {
            "$ref": "#/$defs/D22"
          }
        },
        "required": [
          "version",
          "roles",
          "rolePageAccess",
          "businessSettings",
          "appTheme",
          "logs",
          "importBatches",
          "sessionInventory",
          "reportTemplates",
          "companyAssets"
        ],
        "additionalProperties": false
      },
      "D3": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "label": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "systemRole": {
            "anyOf": [
              {
                "const": "admin"
              },
              {
                "const": "service"
              },
              {
                "const": "service_manager"
              },
              {
                "const": "reception"
              },
              {
                "const": "accounts"
              },
              {
                "const": "store"
              },
              {
                "const": "tech"
              }
            ]
          },
          "isBuiltIn": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "status": {
            "anyOf": [
              {
                "const": "active"
              },
              {
                "const": "archived"
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "updatedAt": {
            "type": "string"
          },
          "archivedAt": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "id",
          "label",
          "description",
          "isBuiltIn",
          "status",
          "createdAt",
          "updatedAt"
        ],
        "additionalProperties": false
      },
      "D4": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "type": "array",
          "items": {
            "anyOf": [
              {
                "const": "receive-vehicle"
              },
              {
                "const": "advance-bookings"
              },
              {
                "const": "today-queue"
              },
              {
                "const": "customers"
              },
              {
                "const": "vehicles"
              },
              {
                "const": "search"
              },
              {
                "const": "my-queue"
              },
              {
                "const": "job-card"
              },
              {
                "const": "estimate"
              },
              {
                "const": "follow-ups"
              },
              {
                "const": "media"
              },
              {
                "const": "material-requests"
              },
              {
                "const": "issue-material"
              },
              {
                "const": "reconcile"
              },
              {
                "const": "stock"
              },
              {
                "const": "approvals"
              },
              {
                "const": "inward-purchases"
              },
              {
                "const": "my-tasks"
              },
              {
                "const": "work-update"
              },
              {
                "const": "qc-prep"
              },
              {
                "const": "ready-to-invoice"
              },
              {
                "const": "invoice"
              },
              {
                "const": "payment"
              },
              {
                "const": "delivery"
              },
              {
                "const": "dashboard"
              },
              {
                "const": "data-flow"
              },
              {
                "const": "jobs"
              },
              {
                "const": "manage"
              },
              {
                "const": "admin-console"
              },
              {
                "const": "sales-leads"
              },
              {
                "const": "quotations"
              },
              {
                "const": "quotation-settings"
              }
            ]
          }
        }
      },
      "D5": {
        "type": "object",
        "properties": {
          "profile": {
            "$ref": "#/$defs/D6"
          },
          "branch": {
            "$ref": "#/$defs/D7"
          },
          "jobs": {
            "$ref": "#/$defs/D8"
          },
          "pricing": {
            "$ref": "#/$defs/D9"
          },
          "billing": {
            "$ref": "#/$defs/D10"
          },
          "inventory": {
            "$ref": "#/$defs/D11"
          },
          "notifications": {
            "$ref": "#/$defs/D12"
          },
          "logRetention": {
            "$ref": "#/$defs/D13"
          }
        },
        "required": [
          "profile",
          "branch",
          "jobs",
          "pricing",
          "billing",
          "inventory",
          "notifications",
          "logRetention"
        ],
        "additionalProperties": false
      },
      "D6": {
        "type": "object",
        "properties": {
          "businessName": {
            "type": "string"
          },
          "legalName": {
            "type": "string"
          },
          "phone": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "address": {
            "type": "string"
          },
          "footer": {
            "type": "string"
          },
          "timezone": {
            "type": "string"
          },
          "currency": {
            "type": "string"
          }
        },
        "required": [
          "businessName",
          "legalName",
          "phone",
          "email",
          "address",
          "footer",
          "timezone",
          "currency"
        ],
        "additionalProperties": false
      },
      "D7": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "openingTime": {
            "type": "string"
          },
          "closingTime": {
            "type": "string"
          },
          "workingDays": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "holidayBehavior": {
            "anyOf": [
              {
                "const": "closed"
              },
              {
                "const": "appointment-only"
              }
            ]
          }
        },
        "required": [
          "name",
          "openingTime",
          "closingTime",
          "workingDays",
          "holidayBehavior"
        ],
        "additionalProperties": false
      },
      "D8": {
        "type": "object",
        "properties": {
          "jobNumberPrefix": {
            "type": "string"
          },
          "defaultPromisedHours": {
            "type": "number"
          },
          "requireQc": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "washingDefault": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "autoCloseAfterDelivery": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "jobNumberPrefix",
          "defaultPromisedHours",
          "requireQc",
          "washingDefault",
          "autoCloseAfterDelivery"
        ],
        "additionalProperties": false
      },
      "D9": {
        "type": "object",
        "properties": {
          "estimateValidityDays": {
            "type": "number"
          },
          "defaultLabourRate": {
            "type": "number"
          },
          "discountApprovalPercent": {
            "type": "number"
          },
          "requireEstimateApproval": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "estimateValidityDays",
          "defaultLabourRate",
          "discountApprovalPercent",
          "requireEstimateApproval"
        ],
        "additionalProperties": false
      },
      "D10": {
        "type": "object",
        "properties": {
          "gstin": {
            "type": "string"
          },
          "bankAccountHolder": {
            "type": "string"
          },
          "bankName": {
            "type": "string"
          },
          "bankAccountNumber": {
            "type": "string"
          },
          "bankIfsc": {
            "type": "string"
          },
          "bankBranch": {
            "type": "string"
          },
          "upiId": {
            "type": "string"
          },
          "defaultGstPercent": {
            "type": "number"
          },
          "invoicePrefix": {
            "type": "string"
          },
          "receiptPrefix": {
            "type": "string"
          },
          "gatePassPrefix": {
            "type": "string"
          },
          "paymentModes": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "required": [
          "gstin",
          "bankAccountHolder",
          "bankName",
          "bankAccountNumber",
          "bankIfsc",
          "bankBranch",
          "upiId",
          "defaultGstPercent",
          "invoicePrefix",
          "receiptPrefix",
          "gatePassPrefix",
          "paymentModes"
        ],
        "additionalProperties": false
      },
      "D11": {
        "type": "object",
        "properties": {
          "defaultUnit": {
            "type": "string"
          },
          "lowStockNotifications": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "requireAdjustmentReason": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "defaultUnit",
          "lowStockNotifications",
          "requireAdjustmentReason"
        ],
        "additionalProperties": false
      },
      "D12": {
        "type": "object",
        "properties": {
          "customerChannels": {
            "type": "array",
            "items": {
              "anyOf": [
                {
                  "const": "sms"
                },
                {
                  "const": "email"
                },
                {
                  "const": "whatsapp"
                }
              ]
            }
          },
          "documentHeader": {
            "type": "string"
          },
          "estimateTemplate": {
            "type": "string"
          },
          "invoiceTemplate": {
            "type": "string"
          },
          "jobCardCreatedWhatsAppTemplate": {
            "type": "string"
          },
          "jobCardCreatedEmailTemplate": {
            "type": "string"
          },
          "jobCardClosedWhatsAppTemplate": {
            "type": "string"
          },
          "jobCardClosedEmailTemplate": {
            "type": "string"
          }
        },
        "required": [
          "customerChannels",
          "documentHeader",
          "estimateTemplate",
          "invoiceTemplate",
          "jobCardCreatedWhatsAppTemplate",
          "jobCardCreatedEmailTemplate",
          "jobCardClosedWhatsAppTemplate",
          "jobCardClosedEmailTemplate"
        ],
        "additionalProperties": false
      },
      "D13": {
        "type": "object",
        "properties": {
          "operationalDays": {
            "type": "number"
          },
          "featureDays": {
            "type": "number"
          }
        },
        "required": [
          "operationalDays",
          "featureDays"
        ],
        "additionalProperties": false
      },
      "D14": {
        "type": "object",
        "properties": {
          "fontId": {
            "anyOf": [
              {
                "const": "system"
              },
              {
                "const": "arial"
              },
              {
                "const": "verdana"
              },
              {
                "const": "trebuchet"
              },
              {
                "const": "georgia"
              }
            ]
          },
          "paletteId": {
            "anyOf": [
              {
                "const": "go-lite"
              },
              {
                "const": "go-yellow"
              },
              {
                "const": "go-orange"
              },
              {
                "const": "go-blue"
              }
            ]
          }
        },
        "required": [
          "fontId",
          "paletteId"
        ],
        "additionalProperties": false
      },
      "D15": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "stream": {
            "anyOf": [
              {
                "const": "operational"
              },
              {
                "const": "feature"
              }
            ]
          },
          "timestamp": {
            "type": "string"
          },
          "level": {
            "anyOf": [
              {
                "const": "info"
              },
              {
                "const": "warning"
              },
              {
                "const": "error"
              }
            ]
          },
          "area": {
            "type": "string"
          },
          "feature": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "userId": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "userName": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "referenceId": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "details": {
            "anyOf": [
              {
                "$ref": "#/$defs/D16"
              }
            ]
          }
        },
        "required": [
          "id",
          "stream",
          "timestamp",
          "level",
          "area",
          "feature",
          "message"
        ],
        "additionalProperties": false
      },
      "D16": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "x-unverified": "unknown"
        }
      },
      "D17": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "fileName": {
            "type": "string"
          },
          "status": {
            "anyOf": [
              {
                "const": "mapping"
              },
              {
                "const": "validated"
              },
              {
                "const": "imported"
              },
              {
                "const": "failed"
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "importedAt": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "totalRows": {
            "type": "number"
          },
          "acceptedRows": {
            "type": "number"
          },
          "rejectedRows": {
            "type": "number"
          },
          "columnMapping": {
            "$ref": "#/$defs/D18"
          },
          "errors": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D19"
            }
          }
        },
        "required": [
          "id",
          "fileName",
          "status",
          "createdAt",
          "totalRows",
          "acceptedRows",
          "rejectedRows",
          "columnMapping",
          "errors"
        ],
        "additionalProperties": false
      },
      "D18": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "type": "string"
        }
      },
      "D19": {
        "type": "object",
        "properties": {
          "row": {
            "type": "number"
          },
          "field": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "message": {
            "type": "string"
          }
        },
        "required": [
          "row",
          "message"
        ],
        "additionalProperties": false
      },
      "D20": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "importBatchId": {
            "type": "string"
          },
          "sku": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "category": {
            "type": "string"
          },
          "unit": {
            "type": "string"
          },
          "stockQty": {
            "type": "number"
          },
          "lowStockQty": {
            "type": "number"
          },
          "sellingPrice": {
            "type": "number"
          },
          "importedAt": {
            "type": "string"
          }
        },
        "required": [
          "id",
          "importBatchId",
          "sku",
          "name",
          "category",
          "unit",
          "stockQty",
          "lowStockQty",
          "sellingPrice",
          "importedAt"
        ],
        "additionalProperties": false
      },
      "D21": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "category": {
            "anyOf": [
              {
                "const": "job-card"
              },
              {
                "const": "estimate"
              },
              {
                "const": "invoice"
              },
              {
                "const": "quotation"
              },
              {
                "const": "gate-pass"
              },
              {
                "const": "payment-receipt"
              }
            ]
          },
          "name": {
            "type": "string"
          },
          "html": {
            "type": "string"
          },
          "active": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "updatedAt": {
            "type": "string"
          },
          "seedVersion": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [
          "id",
          "category",
          "name",
          "html",
          "active",
          "createdAt",
          "updatedAt"
        ],
        "additionalProperties": false
      },
      "D22": {
        "type": "object",
        "properties": {
          "logo": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          },
          "stamp": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          },
          "authorizedSignature": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "logo",
          "stamp",
          "authorizedSignature"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": [
      "unknown"
    ]
  },
  {
    "operation": "OP-admin-demo-state-updateDemoRole",
    "route": "POST /api/v1/ui/commands/updateDemoRole",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "roleId": {
              "type": "string"
            },
            "updates": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "roleId",
            "updates"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "$ref": "#/$defs/D2"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "label": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "description": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [],
        "additionalProperties": false
      },
      "D2": {
        "type": "object",
        "properties": {
          "version": {
            "const": 2
          },
          "roles": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D3"
            }
          },
          "rolePageAccess": {
            "$ref": "#/$defs/D4"
          },
          "businessSettings": {
            "$ref": "#/$defs/D5"
          },
          "appTheme": {
            "$ref": "#/$defs/D14"
          },
          "logs": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D15"
            }
          },
          "importBatches": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D17"
            }
          },
          "sessionInventory": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D20"
            }
          },
          "reportTemplates": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D21"
            }
          },
          "companyAssets": {
            "$ref": "#/$defs/D22"
          }
        },
        "required": [
          "version",
          "roles",
          "rolePageAccess",
          "businessSettings",
          "appTheme",
          "logs",
          "importBatches",
          "sessionInventory",
          "reportTemplates",
          "companyAssets"
        ],
        "additionalProperties": false
      },
      "D3": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "label": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "systemRole": {
            "anyOf": [
              {
                "const": "admin"
              },
              {
                "const": "service"
              },
              {
                "const": "service_manager"
              },
              {
                "const": "reception"
              },
              {
                "const": "accounts"
              },
              {
                "const": "store"
              },
              {
                "const": "tech"
              }
            ]
          },
          "isBuiltIn": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "status": {
            "anyOf": [
              {
                "const": "active"
              },
              {
                "const": "archived"
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "updatedAt": {
            "type": "string"
          },
          "archivedAt": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "id",
          "label",
          "description",
          "isBuiltIn",
          "status",
          "createdAt",
          "updatedAt"
        ],
        "additionalProperties": false
      },
      "D4": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "type": "array",
          "items": {
            "anyOf": [
              {
                "const": "receive-vehicle"
              },
              {
                "const": "advance-bookings"
              },
              {
                "const": "today-queue"
              },
              {
                "const": "customers"
              },
              {
                "const": "vehicles"
              },
              {
                "const": "search"
              },
              {
                "const": "my-queue"
              },
              {
                "const": "job-card"
              },
              {
                "const": "estimate"
              },
              {
                "const": "follow-ups"
              },
              {
                "const": "media"
              },
              {
                "const": "material-requests"
              },
              {
                "const": "issue-material"
              },
              {
                "const": "reconcile"
              },
              {
                "const": "stock"
              },
              {
                "const": "approvals"
              },
              {
                "const": "inward-purchases"
              },
              {
                "const": "my-tasks"
              },
              {
                "const": "work-update"
              },
              {
                "const": "qc-prep"
              },
              {
                "const": "ready-to-invoice"
              },
              {
                "const": "invoice"
              },
              {
                "const": "payment"
              },
              {
                "const": "delivery"
              },
              {
                "const": "dashboard"
              },
              {
                "const": "data-flow"
              },
              {
                "const": "jobs"
              },
              {
                "const": "manage"
              },
              {
                "const": "admin-console"
              },
              {
                "const": "sales-leads"
              },
              {
                "const": "quotations"
              },
              {
                "const": "quotation-settings"
              }
            ]
          }
        }
      },
      "D5": {
        "type": "object",
        "properties": {
          "profile": {
            "$ref": "#/$defs/D6"
          },
          "branch": {
            "$ref": "#/$defs/D7"
          },
          "jobs": {
            "$ref": "#/$defs/D8"
          },
          "pricing": {
            "$ref": "#/$defs/D9"
          },
          "billing": {
            "$ref": "#/$defs/D10"
          },
          "inventory": {
            "$ref": "#/$defs/D11"
          },
          "notifications": {
            "$ref": "#/$defs/D12"
          },
          "logRetention": {
            "$ref": "#/$defs/D13"
          }
        },
        "required": [
          "profile",
          "branch",
          "jobs",
          "pricing",
          "billing",
          "inventory",
          "notifications",
          "logRetention"
        ],
        "additionalProperties": false
      },
      "D6": {
        "type": "object",
        "properties": {
          "businessName": {
            "type": "string"
          },
          "legalName": {
            "type": "string"
          },
          "phone": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "address": {
            "type": "string"
          },
          "footer": {
            "type": "string"
          },
          "timezone": {
            "type": "string"
          },
          "currency": {
            "type": "string"
          }
        },
        "required": [
          "businessName",
          "legalName",
          "phone",
          "email",
          "address",
          "footer",
          "timezone",
          "currency"
        ],
        "additionalProperties": false
      },
      "D7": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "openingTime": {
            "type": "string"
          },
          "closingTime": {
            "type": "string"
          },
          "workingDays": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "holidayBehavior": {
            "anyOf": [
              {
                "const": "closed"
              },
              {
                "const": "appointment-only"
              }
            ]
          }
        },
        "required": [
          "name",
          "openingTime",
          "closingTime",
          "workingDays",
          "holidayBehavior"
        ],
        "additionalProperties": false
      },
      "D8": {
        "type": "object",
        "properties": {
          "jobNumberPrefix": {
            "type": "string"
          },
          "defaultPromisedHours": {
            "type": "number"
          },
          "requireQc": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "washingDefault": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "autoCloseAfterDelivery": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "jobNumberPrefix",
          "defaultPromisedHours",
          "requireQc",
          "washingDefault",
          "autoCloseAfterDelivery"
        ],
        "additionalProperties": false
      },
      "D9": {
        "type": "object",
        "properties": {
          "estimateValidityDays": {
            "type": "number"
          },
          "defaultLabourRate": {
            "type": "number"
          },
          "discountApprovalPercent": {
            "type": "number"
          },
          "requireEstimateApproval": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "estimateValidityDays",
          "defaultLabourRate",
          "discountApprovalPercent",
          "requireEstimateApproval"
        ],
        "additionalProperties": false
      },
      "D10": {
        "type": "object",
        "properties": {
          "gstin": {
            "type": "string"
          },
          "bankAccountHolder": {
            "type": "string"
          },
          "bankName": {
            "type": "string"
          },
          "bankAccountNumber": {
            "type": "string"
          },
          "bankIfsc": {
            "type": "string"
          },
          "bankBranch": {
            "type": "string"
          },
          "upiId": {
            "type": "string"
          },
          "defaultGstPercent": {
            "type": "number"
          },
          "invoicePrefix": {
            "type": "string"
          },
          "receiptPrefix": {
            "type": "string"
          },
          "gatePassPrefix": {
            "type": "string"
          },
          "paymentModes": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "required": [
          "gstin",
          "bankAccountHolder",
          "bankName",
          "bankAccountNumber",
          "bankIfsc",
          "bankBranch",
          "upiId",
          "defaultGstPercent",
          "invoicePrefix",
          "receiptPrefix",
          "gatePassPrefix",
          "paymentModes"
        ],
        "additionalProperties": false
      },
      "D11": {
        "type": "object",
        "properties": {
          "defaultUnit": {
            "type": "string"
          },
          "lowStockNotifications": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "requireAdjustmentReason": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "defaultUnit",
          "lowStockNotifications",
          "requireAdjustmentReason"
        ],
        "additionalProperties": false
      },
      "D12": {
        "type": "object",
        "properties": {
          "customerChannels": {
            "type": "array",
            "items": {
              "anyOf": [
                {
                  "const": "sms"
                },
                {
                  "const": "email"
                },
                {
                  "const": "whatsapp"
                }
              ]
            }
          },
          "documentHeader": {
            "type": "string"
          },
          "estimateTemplate": {
            "type": "string"
          },
          "invoiceTemplate": {
            "type": "string"
          },
          "jobCardCreatedWhatsAppTemplate": {
            "type": "string"
          },
          "jobCardCreatedEmailTemplate": {
            "type": "string"
          },
          "jobCardClosedWhatsAppTemplate": {
            "type": "string"
          },
          "jobCardClosedEmailTemplate": {
            "type": "string"
          }
        },
        "required": [
          "customerChannels",
          "documentHeader",
          "estimateTemplate",
          "invoiceTemplate",
          "jobCardCreatedWhatsAppTemplate",
          "jobCardCreatedEmailTemplate",
          "jobCardClosedWhatsAppTemplate",
          "jobCardClosedEmailTemplate"
        ],
        "additionalProperties": false
      },
      "D13": {
        "type": "object",
        "properties": {
          "operationalDays": {
            "type": "number"
          },
          "featureDays": {
            "type": "number"
          }
        },
        "required": [
          "operationalDays",
          "featureDays"
        ],
        "additionalProperties": false
      },
      "D14": {
        "type": "object",
        "properties": {
          "fontId": {
            "anyOf": [
              {
                "const": "system"
              },
              {
                "const": "arial"
              },
              {
                "const": "verdana"
              },
              {
                "const": "trebuchet"
              },
              {
                "const": "georgia"
              }
            ]
          },
          "paletteId": {
            "anyOf": [
              {
                "const": "go-lite"
              },
              {
                "const": "go-yellow"
              },
              {
                "const": "go-orange"
              },
              {
                "const": "go-blue"
              }
            ]
          }
        },
        "required": [
          "fontId",
          "paletteId"
        ],
        "additionalProperties": false
      },
      "D15": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "stream": {
            "anyOf": [
              {
                "const": "operational"
              },
              {
                "const": "feature"
              }
            ]
          },
          "timestamp": {
            "type": "string"
          },
          "level": {
            "anyOf": [
              {
                "const": "info"
              },
              {
                "const": "warning"
              },
              {
                "const": "error"
              }
            ]
          },
          "area": {
            "type": "string"
          },
          "feature": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "userId": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "userName": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "referenceId": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "details": {
            "anyOf": [
              {
                "$ref": "#/$defs/D16"
              }
            ]
          }
        },
        "required": [
          "id",
          "stream",
          "timestamp",
          "level",
          "area",
          "feature",
          "message"
        ],
        "additionalProperties": false
      },
      "D16": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "x-unverified": "unknown"
        }
      },
      "D17": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "fileName": {
            "type": "string"
          },
          "status": {
            "anyOf": [
              {
                "const": "mapping"
              },
              {
                "const": "validated"
              },
              {
                "const": "imported"
              },
              {
                "const": "failed"
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "importedAt": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "totalRows": {
            "type": "number"
          },
          "acceptedRows": {
            "type": "number"
          },
          "rejectedRows": {
            "type": "number"
          },
          "columnMapping": {
            "$ref": "#/$defs/D18"
          },
          "errors": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D19"
            }
          }
        },
        "required": [
          "id",
          "fileName",
          "status",
          "createdAt",
          "totalRows",
          "acceptedRows",
          "rejectedRows",
          "columnMapping",
          "errors"
        ],
        "additionalProperties": false
      },
      "D18": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "type": "string"
        }
      },
      "D19": {
        "type": "object",
        "properties": {
          "row": {
            "type": "number"
          },
          "field": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "message": {
            "type": "string"
          }
        },
        "required": [
          "row",
          "message"
        ],
        "additionalProperties": false
      },
      "D20": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "importBatchId": {
            "type": "string"
          },
          "sku": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "category": {
            "type": "string"
          },
          "unit": {
            "type": "string"
          },
          "stockQty": {
            "type": "number"
          },
          "lowStockQty": {
            "type": "number"
          },
          "sellingPrice": {
            "type": "number"
          },
          "importedAt": {
            "type": "string"
          }
        },
        "required": [
          "id",
          "importBatchId",
          "sku",
          "name",
          "category",
          "unit",
          "stockQty",
          "lowStockQty",
          "sellingPrice",
          "importedAt"
        ],
        "additionalProperties": false
      },
      "D21": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "category": {
            "anyOf": [
              {
                "const": "job-card"
              },
              {
                "const": "estimate"
              },
              {
                "const": "invoice"
              },
              {
                "const": "quotation"
              },
              {
                "const": "gate-pass"
              },
              {
                "const": "payment-receipt"
              }
            ]
          },
          "name": {
            "type": "string"
          },
          "html": {
            "type": "string"
          },
          "active": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "updatedAt": {
            "type": "string"
          },
          "seedVersion": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [
          "id",
          "category",
          "name",
          "html",
          "active",
          "createdAt",
          "updatedAt"
        ],
        "additionalProperties": false
      },
      "D22": {
        "type": "object",
        "properties": {
          "logo": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          },
          "stamp": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          },
          "authorizedSignature": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "logo",
          "stamp",
          "authorizedSignature"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": [
      "unknown"
    ]
  },
  {
    "operation": "OP-admin-demo-state-archiveDemoRole",
    "route": "POST /api/v1/ui/commands/archiveDemoRole",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "roleId": {
              "type": "string"
            }
          },
          "required": [
            "roleId"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "$ref": "#/$defs/D1"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "version": {
            "const": 2
          },
          "roles": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D2"
            }
          },
          "rolePageAccess": {
            "$ref": "#/$defs/D3"
          },
          "businessSettings": {
            "$ref": "#/$defs/D4"
          },
          "appTheme": {
            "$ref": "#/$defs/D13"
          },
          "logs": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D14"
            }
          },
          "importBatches": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D16"
            }
          },
          "sessionInventory": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D19"
            }
          },
          "reportTemplates": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D20"
            }
          },
          "companyAssets": {
            "$ref": "#/$defs/D21"
          }
        },
        "required": [
          "version",
          "roles",
          "rolePageAccess",
          "businessSettings",
          "appTheme",
          "logs",
          "importBatches",
          "sessionInventory",
          "reportTemplates",
          "companyAssets"
        ],
        "additionalProperties": false
      },
      "D2": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "label": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "systemRole": {
            "anyOf": [
              {
                "const": "admin"
              },
              {
                "const": "service"
              },
              {
                "const": "service_manager"
              },
              {
                "const": "reception"
              },
              {
                "const": "accounts"
              },
              {
                "const": "store"
              },
              {
                "const": "tech"
              }
            ]
          },
          "isBuiltIn": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "status": {
            "anyOf": [
              {
                "const": "active"
              },
              {
                "const": "archived"
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "updatedAt": {
            "type": "string"
          },
          "archivedAt": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "id",
          "label",
          "description",
          "isBuiltIn",
          "status",
          "createdAt",
          "updatedAt"
        ],
        "additionalProperties": false
      },
      "D3": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "type": "array",
          "items": {
            "anyOf": [
              {
                "const": "receive-vehicle"
              },
              {
                "const": "advance-bookings"
              },
              {
                "const": "today-queue"
              },
              {
                "const": "customers"
              },
              {
                "const": "vehicles"
              },
              {
                "const": "search"
              },
              {
                "const": "my-queue"
              },
              {
                "const": "job-card"
              },
              {
                "const": "estimate"
              },
              {
                "const": "follow-ups"
              },
              {
                "const": "media"
              },
              {
                "const": "material-requests"
              },
              {
                "const": "issue-material"
              },
              {
                "const": "reconcile"
              },
              {
                "const": "stock"
              },
              {
                "const": "approvals"
              },
              {
                "const": "inward-purchases"
              },
              {
                "const": "my-tasks"
              },
              {
                "const": "work-update"
              },
              {
                "const": "qc-prep"
              },
              {
                "const": "ready-to-invoice"
              },
              {
                "const": "invoice"
              },
              {
                "const": "payment"
              },
              {
                "const": "delivery"
              },
              {
                "const": "dashboard"
              },
              {
                "const": "data-flow"
              },
              {
                "const": "jobs"
              },
              {
                "const": "manage"
              },
              {
                "const": "admin-console"
              },
              {
                "const": "sales-leads"
              },
              {
                "const": "quotations"
              },
              {
                "const": "quotation-settings"
              }
            ]
          }
        }
      },
      "D4": {
        "type": "object",
        "properties": {
          "profile": {
            "$ref": "#/$defs/D5"
          },
          "branch": {
            "$ref": "#/$defs/D6"
          },
          "jobs": {
            "$ref": "#/$defs/D7"
          },
          "pricing": {
            "$ref": "#/$defs/D8"
          },
          "billing": {
            "$ref": "#/$defs/D9"
          },
          "inventory": {
            "$ref": "#/$defs/D10"
          },
          "notifications": {
            "$ref": "#/$defs/D11"
          },
          "logRetention": {
            "$ref": "#/$defs/D12"
          }
        },
        "required": [
          "profile",
          "branch",
          "jobs",
          "pricing",
          "billing",
          "inventory",
          "notifications",
          "logRetention"
        ],
        "additionalProperties": false
      },
      "D5": {
        "type": "object",
        "properties": {
          "businessName": {
            "type": "string"
          },
          "legalName": {
            "type": "string"
          },
          "phone": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "address": {
            "type": "string"
          },
          "footer": {
            "type": "string"
          },
          "timezone": {
            "type": "string"
          },
          "currency": {
            "type": "string"
          }
        },
        "required": [
          "businessName",
          "legalName",
          "phone",
          "email",
          "address",
          "footer",
          "timezone",
          "currency"
        ],
        "additionalProperties": false
      },
      "D6": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "openingTime": {
            "type": "string"
          },
          "closingTime": {
            "type": "string"
          },
          "workingDays": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "holidayBehavior": {
            "anyOf": [
              {
                "const": "closed"
              },
              {
                "const": "appointment-only"
              }
            ]
          }
        },
        "required": [
          "name",
          "openingTime",
          "closingTime",
          "workingDays",
          "holidayBehavior"
        ],
        "additionalProperties": false
      },
      "D7": {
        "type": "object",
        "properties": {
          "jobNumberPrefix": {
            "type": "string"
          },
          "defaultPromisedHours": {
            "type": "number"
          },
          "requireQc": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "washingDefault": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "autoCloseAfterDelivery": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "jobNumberPrefix",
          "defaultPromisedHours",
          "requireQc",
          "washingDefault",
          "autoCloseAfterDelivery"
        ],
        "additionalProperties": false
      },
      "D8": {
        "type": "object",
        "properties": {
          "estimateValidityDays": {
            "type": "number"
          },
          "defaultLabourRate": {
            "type": "number"
          },
          "discountApprovalPercent": {
            "type": "number"
          },
          "requireEstimateApproval": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "estimateValidityDays",
          "defaultLabourRate",
          "discountApprovalPercent",
          "requireEstimateApproval"
        ],
        "additionalProperties": false
      },
      "D9": {
        "type": "object",
        "properties": {
          "gstin": {
            "type": "string"
          },
          "bankAccountHolder": {
            "type": "string"
          },
          "bankName": {
            "type": "string"
          },
          "bankAccountNumber": {
            "type": "string"
          },
          "bankIfsc": {
            "type": "string"
          },
          "bankBranch": {
            "type": "string"
          },
          "upiId": {
            "type": "string"
          },
          "defaultGstPercent": {
            "type": "number"
          },
          "invoicePrefix": {
            "type": "string"
          },
          "receiptPrefix": {
            "type": "string"
          },
          "gatePassPrefix": {
            "type": "string"
          },
          "paymentModes": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "required": [
          "gstin",
          "bankAccountHolder",
          "bankName",
          "bankAccountNumber",
          "bankIfsc",
          "bankBranch",
          "upiId",
          "defaultGstPercent",
          "invoicePrefix",
          "receiptPrefix",
          "gatePassPrefix",
          "paymentModes"
        ],
        "additionalProperties": false
      },
      "D10": {
        "type": "object",
        "properties": {
          "defaultUnit": {
            "type": "string"
          },
          "lowStockNotifications": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "requireAdjustmentReason": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "defaultUnit",
          "lowStockNotifications",
          "requireAdjustmentReason"
        ],
        "additionalProperties": false
      },
      "D11": {
        "type": "object",
        "properties": {
          "customerChannels": {
            "type": "array",
            "items": {
              "anyOf": [
                {
                  "const": "sms"
                },
                {
                  "const": "email"
                },
                {
                  "const": "whatsapp"
                }
              ]
            }
          },
          "documentHeader": {
            "type": "string"
          },
          "estimateTemplate": {
            "type": "string"
          },
          "invoiceTemplate": {
            "type": "string"
          },
          "jobCardCreatedWhatsAppTemplate": {
            "type": "string"
          },
          "jobCardCreatedEmailTemplate": {
            "type": "string"
          },
          "jobCardClosedWhatsAppTemplate": {
            "type": "string"
          },
          "jobCardClosedEmailTemplate": {
            "type": "string"
          }
        },
        "required": [
          "customerChannels",
          "documentHeader",
          "estimateTemplate",
          "invoiceTemplate",
          "jobCardCreatedWhatsAppTemplate",
          "jobCardCreatedEmailTemplate",
          "jobCardClosedWhatsAppTemplate",
          "jobCardClosedEmailTemplate"
        ],
        "additionalProperties": false
      },
      "D12": {
        "type": "object",
        "properties": {
          "operationalDays": {
            "type": "number"
          },
          "featureDays": {
            "type": "number"
          }
        },
        "required": [
          "operationalDays",
          "featureDays"
        ],
        "additionalProperties": false
      },
      "D13": {
        "type": "object",
        "properties": {
          "fontId": {
            "anyOf": [
              {
                "const": "system"
              },
              {
                "const": "arial"
              },
              {
                "const": "verdana"
              },
              {
                "const": "trebuchet"
              },
              {
                "const": "georgia"
              }
            ]
          },
          "paletteId": {
            "anyOf": [
              {
                "const": "go-lite"
              },
              {
                "const": "go-yellow"
              },
              {
                "const": "go-orange"
              },
              {
                "const": "go-blue"
              }
            ]
          }
        },
        "required": [
          "fontId",
          "paletteId"
        ],
        "additionalProperties": false
      },
      "D14": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "stream": {
            "anyOf": [
              {
                "const": "operational"
              },
              {
                "const": "feature"
              }
            ]
          },
          "timestamp": {
            "type": "string"
          },
          "level": {
            "anyOf": [
              {
                "const": "info"
              },
              {
                "const": "warning"
              },
              {
                "const": "error"
              }
            ]
          },
          "area": {
            "type": "string"
          },
          "feature": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "userId": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "userName": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "referenceId": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "details": {
            "anyOf": [
              {
                "$ref": "#/$defs/D15"
              }
            ]
          }
        },
        "required": [
          "id",
          "stream",
          "timestamp",
          "level",
          "area",
          "feature",
          "message"
        ],
        "additionalProperties": false
      },
      "D15": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "x-unverified": "unknown"
        }
      },
      "D16": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "fileName": {
            "type": "string"
          },
          "status": {
            "anyOf": [
              {
                "const": "mapping"
              },
              {
                "const": "validated"
              },
              {
                "const": "imported"
              },
              {
                "const": "failed"
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "importedAt": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "totalRows": {
            "type": "number"
          },
          "acceptedRows": {
            "type": "number"
          },
          "rejectedRows": {
            "type": "number"
          },
          "columnMapping": {
            "$ref": "#/$defs/D17"
          },
          "errors": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D18"
            }
          }
        },
        "required": [
          "id",
          "fileName",
          "status",
          "createdAt",
          "totalRows",
          "acceptedRows",
          "rejectedRows",
          "columnMapping",
          "errors"
        ],
        "additionalProperties": false
      },
      "D17": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "type": "string"
        }
      },
      "D18": {
        "type": "object",
        "properties": {
          "row": {
            "type": "number"
          },
          "field": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "message": {
            "type": "string"
          }
        },
        "required": [
          "row",
          "message"
        ],
        "additionalProperties": false
      },
      "D19": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "importBatchId": {
            "type": "string"
          },
          "sku": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "category": {
            "type": "string"
          },
          "unit": {
            "type": "string"
          },
          "stockQty": {
            "type": "number"
          },
          "lowStockQty": {
            "type": "number"
          },
          "sellingPrice": {
            "type": "number"
          },
          "importedAt": {
            "type": "string"
          }
        },
        "required": [
          "id",
          "importBatchId",
          "sku",
          "name",
          "category",
          "unit",
          "stockQty",
          "lowStockQty",
          "sellingPrice",
          "importedAt"
        ],
        "additionalProperties": false
      },
      "D20": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "category": {
            "anyOf": [
              {
                "const": "job-card"
              },
              {
                "const": "estimate"
              },
              {
                "const": "invoice"
              },
              {
                "const": "quotation"
              },
              {
                "const": "gate-pass"
              },
              {
                "const": "payment-receipt"
              }
            ]
          },
          "name": {
            "type": "string"
          },
          "html": {
            "type": "string"
          },
          "active": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "updatedAt": {
            "type": "string"
          },
          "seedVersion": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [
          "id",
          "category",
          "name",
          "html",
          "active",
          "createdAt",
          "updatedAt"
        ],
        "additionalProperties": false
      },
      "D21": {
        "type": "object",
        "properties": {
          "logo": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          },
          "stamp": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          },
          "authorizedSignature": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "logo",
          "stamp",
          "authorizedSignature"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": [
      "unknown"
    ]
  },
  {
    "operation": "OP-admin-demo-state-updateRolePageAccess",
    "route": "POST /api/v1/ui/commands/updateRolePageAccess",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "roleId": {
              "type": "string"
            },
            "pages": {
              "type": "array",
              "items": {
                "anyOf": [
                  {
                    "const": "receive-vehicle"
                  },
                  {
                    "const": "advance-bookings"
                  },
                  {
                    "const": "today-queue"
                  },
                  {
                    "const": "customers"
                  },
                  {
                    "const": "vehicles"
                  },
                  {
                    "const": "search"
                  },
                  {
                    "const": "my-queue"
                  },
                  {
                    "const": "job-card"
                  },
                  {
                    "const": "estimate"
                  },
                  {
                    "const": "follow-ups"
                  },
                  {
                    "const": "media"
                  },
                  {
                    "const": "material-requests"
                  },
                  {
                    "const": "issue-material"
                  },
                  {
                    "const": "reconcile"
                  },
                  {
                    "const": "stock"
                  },
                  {
                    "const": "approvals"
                  },
                  {
                    "const": "inward-purchases"
                  },
                  {
                    "const": "my-tasks"
                  },
                  {
                    "const": "work-update"
                  },
                  {
                    "const": "qc-prep"
                  },
                  {
                    "const": "ready-to-invoice"
                  },
                  {
                    "const": "invoice"
                  },
                  {
                    "const": "payment"
                  },
                  {
                    "const": "delivery"
                  },
                  {
                    "const": "dashboard"
                  },
                  {
                    "const": "data-flow"
                  },
                  {
                    "const": "jobs"
                  },
                  {
                    "const": "manage"
                  },
                  {
                    "const": "admin-console"
                  },
                  {
                    "const": "sales-leads"
                  },
                  {
                    "const": "quotations"
                  },
                  {
                    "const": "quotation-settings"
                  }
                ]
              }
            }
          },
          "required": [
            "roleId",
            "pages"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "$ref": "#/$defs/D1"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "version": {
            "const": 2
          },
          "roles": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D2"
            }
          },
          "rolePageAccess": {
            "$ref": "#/$defs/D3"
          },
          "businessSettings": {
            "$ref": "#/$defs/D4"
          },
          "appTheme": {
            "$ref": "#/$defs/D13"
          },
          "logs": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D14"
            }
          },
          "importBatches": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D16"
            }
          },
          "sessionInventory": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D19"
            }
          },
          "reportTemplates": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D20"
            }
          },
          "companyAssets": {
            "$ref": "#/$defs/D21"
          }
        },
        "required": [
          "version",
          "roles",
          "rolePageAccess",
          "businessSettings",
          "appTheme",
          "logs",
          "importBatches",
          "sessionInventory",
          "reportTemplates",
          "companyAssets"
        ],
        "additionalProperties": false
      },
      "D2": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "label": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "systemRole": {
            "anyOf": [
              {
                "const": "admin"
              },
              {
                "const": "service"
              },
              {
                "const": "service_manager"
              },
              {
                "const": "reception"
              },
              {
                "const": "accounts"
              },
              {
                "const": "store"
              },
              {
                "const": "tech"
              }
            ]
          },
          "isBuiltIn": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "status": {
            "anyOf": [
              {
                "const": "active"
              },
              {
                "const": "archived"
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "updatedAt": {
            "type": "string"
          },
          "archivedAt": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "id",
          "label",
          "description",
          "isBuiltIn",
          "status",
          "createdAt",
          "updatedAt"
        ],
        "additionalProperties": false
      },
      "D3": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "type": "array",
          "items": {
            "anyOf": [
              {
                "const": "receive-vehicle"
              },
              {
                "const": "advance-bookings"
              },
              {
                "const": "today-queue"
              },
              {
                "const": "customers"
              },
              {
                "const": "vehicles"
              },
              {
                "const": "search"
              },
              {
                "const": "my-queue"
              },
              {
                "const": "job-card"
              },
              {
                "const": "estimate"
              },
              {
                "const": "follow-ups"
              },
              {
                "const": "media"
              },
              {
                "const": "material-requests"
              },
              {
                "const": "issue-material"
              },
              {
                "const": "reconcile"
              },
              {
                "const": "stock"
              },
              {
                "const": "approvals"
              },
              {
                "const": "inward-purchases"
              },
              {
                "const": "my-tasks"
              },
              {
                "const": "work-update"
              },
              {
                "const": "qc-prep"
              },
              {
                "const": "ready-to-invoice"
              },
              {
                "const": "invoice"
              },
              {
                "const": "payment"
              },
              {
                "const": "delivery"
              },
              {
                "const": "dashboard"
              },
              {
                "const": "data-flow"
              },
              {
                "const": "jobs"
              },
              {
                "const": "manage"
              },
              {
                "const": "admin-console"
              },
              {
                "const": "sales-leads"
              },
              {
                "const": "quotations"
              },
              {
                "const": "quotation-settings"
              }
            ]
          }
        }
      },
      "D4": {
        "type": "object",
        "properties": {
          "profile": {
            "$ref": "#/$defs/D5"
          },
          "branch": {
            "$ref": "#/$defs/D6"
          },
          "jobs": {
            "$ref": "#/$defs/D7"
          },
          "pricing": {
            "$ref": "#/$defs/D8"
          },
          "billing": {
            "$ref": "#/$defs/D9"
          },
          "inventory": {
            "$ref": "#/$defs/D10"
          },
          "notifications": {
            "$ref": "#/$defs/D11"
          },
          "logRetention": {
            "$ref": "#/$defs/D12"
          }
        },
        "required": [
          "profile",
          "branch",
          "jobs",
          "pricing",
          "billing",
          "inventory",
          "notifications",
          "logRetention"
        ],
        "additionalProperties": false
      },
      "D5": {
        "type": "object",
        "properties": {
          "businessName": {
            "type": "string"
          },
          "legalName": {
            "type": "string"
          },
          "phone": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "address": {
            "type": "string"
          },
          "footer": {
            "type": "string"
          },
          "timezone": {
            "type": "string"
          },
          "currency": {
            "type": "string"
          }
        },
        "required": [
          "businessName",
          "legalName",
          "phone",
          "email",
          "address",
          "footer",
          "timezone",
          "currency"
        ],
        "additionalProperties": false
      },
      "D6": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "openingTime": {
            "type": "string"
          },
          "closingTime": {
            "type": "string"
          },
          "workingDays": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "holidayBehavior": {
            "anyOf": [
              {
                "const": "closed"
              },
              {
                "const": "appointment-only"
              }
            ]
          }
        },
        "required": [
          "name",
          "openingTime",
          "closingTime",
          "workingDays",
          "holidayBehavior"
        ],
        "additionalProperties": false
      },
      "D7": {
        "type": "object",
        "properties": {
          "jobNumberPrefix": {
            "type": "string"
          },
          "defaultPromisedHours": {
            "type": "number"
          },
          "requireQc": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "washingDefault": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "autoCloseAfterDelivery": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "jobNumberPrefix",
          "defaultPromisedHours",
          "requireQc",
          "washingDefault",
          "autoCloseAfterDelivery"
        ],
        "additionalProperties": false
      },
      "D8": {
        "type": "object",
        "properties": {
          "estimateValidityDays": {
            "type": "number"
          },
          "defaultLabourRate": {
            "type": "number"
          },
          "discountApprovalPercent": {
            "type": "number"
          },
          "requireEstimateApproval": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "estimateValidityDays",
          "defaultLabourRate",
          "discountApprovalPercent",
          "requireEstimateApproval"
        ],
        "additionalProperties": false
      },
      "D9": {
        "type": "object",
        "properties": {
          "gstin": {
            "type": "string"
          },
          "bankAccountHolder": {
            "type": "string"
          },
          "bankName": {
            "type": "string"
          },
          "bankAccountNumber": {
            "type": "string"
          },
          "bankIfsc": {
            "type": "string"
          },
          "bankBranch": {
            "type": "string"
          },
          "upiId": {
            "type": "string"
          },
          "defaultGstPercent": {
            "type": "number"
          },
          "invoicePrefix": {
            "type": "string"
          },
          "receiptPrefix": {
            "type": "string"
          },
          "gatePassPrefix": {
            "type": "string"
          },
          "paymentModes": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "required": [
          "gstin",
          "bankAccountHolder",
          "bankName",
          "bankAccountNumber",
          "bankIfsc",
          "bankBranch",
          "upiId",
          "defaultGstPercent",
          "invoicePrefix",
          "receiptPrefix",
          "gatePassPrefix",
          "paymentModes"
        ],
        "additionalProperties": false
      },
      "D10": {
        "type": "object",
        "properties": {
          "defaultUnit": {
            "type": "string"
          },
          "lowStockNotifications": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "requireAdjustmentReason": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "defaultUnit",
          "lowStockNotifications",
          "requireAdjustmentReason"
        ],
        "additionalProperties": false
      },
      "D11": {
        "type": "object",
        "properties": {
          "customerChannels": {
            "type": "array",
            "items": {
              "anyOf": [
                {
                  "const": "sms"
                },
                {
                  "const": "email"
                },
                {
                  "const": "whatsapp"
                }
              ]
            }
          },
          "documentHeader": {
            "type": "string"
          },
          "estimateTemplate": {
            "type": "string"
          },
          "invoiceTemplate": {
            "type": "string"
          },
          "jobCardCreatedWhatsAppTemplate": {
            "type": "string"
          },
          "jobCardCreatedEmailTemplate": {
            "type": "string"
          },
          "jobCardClosedWhatsAppTemplate": {
            "type": "string"
          },
          "jobCardClosedEmailTemplate": {
            "type": "string"
          }
        },
        "required": [
          "customerChannels",
          "documentHeader",
          "estimateTemplate",
          "invoiceTemplate",
          "jobCardCreatedWhatsAppTemplate",
          "jobCardCreatedEmailTemplate",
          "jobCardClosedWhatsAppTemplate",
          "jobCardClosedEmailTemplate"
        ],
        "additionalProperties": false
      },
      "D12": {
        "type": "object",
        "properties": {
          "operationalDays": {
            "type": "number"
          },
          "featureDays": {
            "type": "number"
          }
        },
        "required": [
          "operationalDays",
          "featureDays"
        ],
        "additionalProperties": false
      },
      "D13": {
        "type": "object",
        "properties": {
          "fontId": {
            "anyOf": [
              {
                "const": "system"
              },
              {
                "const": "arial"
              },
              {
                "const": "verdana"
              },
              {
                "const": "trebuchet"
              },
              {
                "const": "georgia"
              }
            ]
          },
          "paletteId": {
            "anyOf": [
              {
                "const": "go-lite"
              },
              {
                "const": "go-yellow"
              },
              {
                "const": "go-orange"
              },
              {
                "const": "go-blue"
              }
            ]
          }
        },
        "required": [
          "fontId",
          "paletteId"
        ],
        "additionalProperties": false
      },
      "D14": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "stream": {
            "anyOf": [
              {
                "const": "operational"
              },
              {
                "const": "feature"
              }
            ]
          },
          "timestamp": {
            "type": "string"
          },
          "level": {
            "anyOf": [
              {
                "const": "info"
              },
              {
                "const": "warning"
              },
              {
                "const": "error"
              }
            ]
          },
          "area": {
            "type": "string"
          },
          "feature": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "userId": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "userName": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "referenceId": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "details": {
            "anyOf": [
              {
                "$ref": "#/$defs/D15"
              }
            ]
          }
        },
        "required": [
          "id",
          "stream",
          "timestamp",
          "level",
          "area",
          "feature",
          "message"
        ],
        "additionalProperties": false
      },
      "D15": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "x-unverified": "unknown"
        }
      },
      "D16": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "fileName": {
            "type": "string"
          },
          "status": {
            "anyOf": [
              {
                "const": "mapping"
              },
              {
                "const": "validated"
              },
              {
                "const": "imported"
              },
              {
                "const": "failed"
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "importedAt": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "totalRows": {
            "type": "number"
          },
          "acceptedRows": {
            "type": "number"
          },
          "rejectedRows": {
            "type": "number"
          },
          "columnMapping": {
            "$ref": "#/$defs/D17"
          },
          "errors": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D18"
            }
          }
        },
        "required": [
          "id",
          "fileName",
          "status",
          "createdAt",
          "totalRows",
          "acceptedRows",
          "rejectedRows",
          "columnMapping",
          "errors"
        ],
        "additionalProperties": false
      },
      "D17": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "type": "string"
        }
      },
      "D18": {
        "type": "object",
        "properties": {
          "row": {
            "type": "number"
          },
          "field": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "message": {
            "type": "string"
          }
        },
        "required": [
          "row",
          "message"
        ],
        "additionalProperties": false
      },
      "D19": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "importBatchId": {
            "type": "string"
          },
          "sku": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "category": {
            "type": "string"
          },
          "unit": {
            "type": "string"
          },
          "stockQty": {
            "type": "number"
          },
          "lowStockQty": {
            "type": "number"
          },
          "sellingPrice": {
            "type": "number"
          },
          "importedAt": {
            "type": "string"
          }
        },
        "required": [
          "id",
          "importBatchId",
          "sku",
          "name",
          "category",
          "unit",
          "stockQty",
          "lowStockQty",
          "sellingPrice",
          "importedAt"
        ],
        "additionalProperties": false
      },
      "D20": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "category": {
            "anyOf": [
              {
                "const": "job-card"
              },
              {
                "const": "estimate"
              },
              {
                "const": "invoice"
              },
              {
                "const": "quotation"
              },
              {
                "const": "gate-pass"
              },
              {
                "const": "payment-receipt"
              }
            ]
          },
          "name": {
            "type": "string"
          },
          "html": {
            "type": "string"
          },
          "active": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "updatedAt": {
            "type": "string"
          },
          "seedVersion": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [
          "id",
          "category",
          "name",
          "html",
          "active",
          "createdAt",
          "updatedAt"
        ],
        "additionalProperties": false
      },
      "D21": {
        "type": "object",
        "properties": {
          "logo": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          },
          "stamp": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          },
          "authorizedSignature": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "logo",
          "stamp",
          "authorizedSignature"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": [
      "unknown"
    ]
  },
  {
    "operation": "OP-admin-demo-state-updateBusinessSettings",
    "route": "POST /api/v1/ui/commands/updateBusinessSettings",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "updates": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "updates"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "$ref": "#/$defs/D10"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "profile": {
            "anyOf": [
              {
                "$ref": "#/$defs/D2"
              }
            ]
          },
          "branch": {
            "anyOf": [
              {
                "$ref": "#/$defs/D3"
              }
            ]
          },
          "jobs": {
            "anyOf": [
              {
                "$ref": "#/$defs/D4"
              }
            ]
          },
          "pricing": {
            "anyOf": [
              {
                "$ref": "#/$defs/D5"
              }
            ]
          },
          "billing": {
            "anyOf": [
              {
                "$ref": "#/$defs/D6"
              }
            ]
          },
          "inventory": {
            "anyOf": [
              {
                "$ref": "#/$defs/D7"
              }
            ]
          },
          "notifications": {
            "anyOf": [
              {
                "$ref": "#/$defs/D8"
              }
            ]
          },
          "logRetention": {
            "anyOf": [
              {
                "$ref": "#/$defs/D9"
              }
            ]
          }
        },
        "required": [],
        "additionalProperties": false
      },
      "D2": {
        "type": "object",
        "properties": {
          "businessName": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "legalName": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "phone": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "email": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "address": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "footer": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "timezone": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "currency": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [],
        "additionalProperties": false
      },
      "D3": {
        "type": "object",
        "properties": {
          "name": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "openingTime": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "closingTime": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "workingDays": {
            "anyOf": [
              {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            ]
          },
          "holidayBehavior": {
            "anyOf": [
              {
                "const": "closed"
              },
              {
                "const": "appointment-only"
              }
            ]
          }
        },
        "required": [],
        "additionalProperties": false
      },
      "D4": {
        "type": "object",
        "properties": {
          "jobNumberPrefix": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "defaultPromisedHours": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "requireQc": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "washingDefault": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "autoCloseAfterDelivery": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [],
        "additionalProperties": false
      },
      "D5": {
        "type": "object",
        "properties": {
          "estimateValidityDays": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "defaultLabourRate": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "discountApprovalPercent": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "requireEstimateApproval": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [],
        "additionalProperties": false
      },
      "D6": {
        "type": "object",
        "properties": {
          "gstin": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "bankAccountHolder": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "bankName": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "bankAccountNumber": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "bankIfsc": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "bankBranch": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "upiId": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "defaultGstPercent": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "invoicePrefix": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "receiptPrefix": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "gatePassPrefix": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "paymentModes": {
            "anyOf": [
              {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            ]
          }
        },
        "required": [],
        "additionalProperties": false
      },
      "D7": {
        "type": "object",
        "properties": {
          "defaultUnit": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "lowStockNotifications": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "requireAdjustmentReason": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [],
        "additionalProperties": false
      },
      "D8": {
        "type": "object",
        "properties": {
          "customerChannels": {
            "anyOf": [
              {
                "type": "array",
                "items": {
                  "anyOf": [
                    {
                      "const": "sms"
                    },
                    {
                      "const": "email"
                    },
                    {
                      "const": "whatsapp"
                    }
                  ]
                }
              }
            ]
          },
          "documentHeader": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "estimateTemplate": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "invoiceTemplate": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "jobCardCreatedWhatsAppTemplate": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "jobCardCreatedEmailTemplate": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "jobCardClosedWhatsAppTemplate": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "jobCardClosedEmailTemplate": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [],
        "additionalProperties": false
      },
      "D9": {
        "type": "object",
        "properties": {
          "operationalDays": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "featureDays": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [],
        "additionalProperties": false
      },
      "D10": {
        "type": "object",
        "properties": {
          "version": {
            "const": 2
          },
          "roles": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D11"
            }
          },
          "rolePageAccess": {
            "$ref": "#/$defs/D12"
          },
          "businessSettings": {
            "$ref": "#/$defs/D13"
          },
          "appTheme": {
            "$ref": "#/$defs/D22"
          },
          "logs": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D23"
            }
          },
          "importBatches": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D25"
            }
          },
          "sessionInventory": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D28"
            }
          },
          "reportTemplates": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D29"
            }
          },
          "companyAssets": {
            "$ref": "#/$defs/D30"
          }
        },
        "required": [
          "version",
          "roles",
          "rolePageAccess",
          "businessSettings",
          "appTheme",
          "logs",
          "importBatches",
          "sessionInventory",
          "reportTemplates",
          "companyAssets"
        ],
        "additionalProperties": false
      },
      "D11": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "label": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "systemRole": {
            "anyOf": [
              {
                "const": "admin"
              },
              {
                "const": "service"
              },
              {
                "const": "service_manager"
              },
              {
                "const": "reception"
              },
              {
                "const": "accounts"
              },
              {
                "const": "store"
              },
              {
                "const": "tech"
              }
            ]
          },
          "isBuiltIn": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "status": {
            "anyOf": [
              {
                "const": "active"
              },
              {
                "const": "archived"
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "updatedAt": {
            "type": "string"
          },
          "archivedAt": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "id",
          "label",
          "description",
          "isBuiltIn",
          "status",
          "createdAt",
          "updatedAt"
        ],
        "additionalProperties": false
      },
      "D12": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "type": "array",
          "items": {
            "anyOf": [
              {
                "const": "receive-vehicle"
              },
              {
                "const": "advance-bookings"
              },
              {
                "const": "today-queue"
              },
              {
                "const": "customers"
              },
              {
                "const": "vehicles"
              },
              {
                "const": "search"
              },
              {
                "const": "my-queue"
              },
              {
                "const": "job-card"
              },
              {
                "const": "estimate"
              },
              {
                "const": "follow-ups"
              },
              {
                "const": "media"
              },
              {
                "const": "material-requests"
              },
              {
                "const": "issue-material"
              },
              {
                "const": "reconcile"
              },
              {
                "const": "stock"
              },
              {
                "const": "approvals"
              },
              {
                "const": "inward-purchases"
              },
              {
                "const": "my-tasks"
              },
              {
                "const": "work-update"
              },
              {
                "const": "qc-prep"
              },
              {
                "const": "ready-to-invoice"
              },
              {
                "const": "invoice"
              },
              {
                "const": "payment"
              },
              {
                "const": "delivery"
              },
              {
                "const": "dashboard"
              },
              {
                "const": "data-flow"
              },
              {
                "const": "jobs"
              },
              {
                "const": "manage"
              },
              {
                "const": "admin-console"
              },
              {
                "const": "sales-leads"
              },
              {
                "const": "quotations"
              },
              {
                "const": "quotation-settings"
              }
            ]
          }
        }
      },
      "D13": {
        "type": "object",
        "properties": {
          "profile": {
            "$ref": "#/$defs/D14"
          },
          "branch": {
            "$ref": "#/$defs/D15"
          },
          "jobs": {
            "$ref": "#/$defs/D16"
          },
          "pricing": {
            "$ref": "#/$defs/D17"
          },
          "billing": {
            "$ref": "#/$defs/D18"
          },
          "inventory": {
            "$ref": "#/$defs/D19"
          },
          "notifications": {
            "$ref": "#/$defs/D20"
          },
          "logRetention": {
            "$ref": "#/$defs/D21"
          }
        },
        "required": [
          "profile",
          "branch",
          "jobs",
          "pricing",
          "billing",
          "inventory",
          "notifications",
          "logRetention"
        ],
        "additionalProperties": false
      },
      "D14": {
        "type": "object",
        "properties": {
          "businessName": {
            "type": "string"
          },
          "legalName": {
            "type": "string"
          },
          "phone": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "address": {
            "type": "string"
          },
          "footer": {
            "type": "string"
          },
          "timezone": {
            "type": "string"
          },
          "currency": {
            "type": "string"
          }
        },
        "required": [
          "businessName",
          "legalName",
          "phone",
          "email",
          "address",
          "footer",
          "timezone",
          "currency"
        ],
        "additionalProperties": false
      },
      "D15": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "openingTime": {
            "type": "string"
          },
          "closingTime": {
            "type": "string"
          },
          "workingDays": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "holidayBehavior": {
            "anyOf": [
              {
                "const": "closed"
              },
              {
                "const": "appointment-only"
              }
            ]
          }
        },
        "required": [
          "name",
          "openingTime",
          "closingTime",
          "workingDays",
          "holidayBehavior"
        ],
        "additionalProperties": false
      },
      "D16": {
        "type": "object",
        "properties": {
          "jobNumberPrefix": {
            "type": "string"
          },
          "defaultPromisedHours": {
            "type": "number"
          },
          "requireQc": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "washingDefault": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "autoCloseAfterDelivery": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "jobNumberPrefix",
          "defaultPromisedHours",
          "requireQc",
          "washingDefault",
          "autoCloseAfterDelivery"
        ],
        "additionalProperties": false
      },
      "D17": {
        "type": "object",
        "properties": {
          "estimateValidityDays": {
            "type": "number"
          },
          "defaultLabourRate": {
            "type": "number"
          },
          "discountApprovalPercent": {
            "type": "number"
          },
          "requireEstimateApproval": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "estimateValidityDays",
          "defaultLabourRate",
          "discountApprovalPercent",
          "requireEstimateApproval"
        ],
        "additionalProperties": false
      },
      "D18": {
        "type": "object",
        "properties": {
          "gstin": {
            "type": "string"
          },
          "bankAccountHolder": {
            "type": "string"
          },
          "bankName": {
            "type": "string"
          },
          "bankAccountNumber": {
            "type": "string"
          },
          "bankIfsc": {
            "type": "string"
          },
          "bankBranch": {
            "type": "string"
          },
          "upiId": {
            "type": "string"
          },
          "defaultGstPercent": {
            "type": "number"
          },
          "invoicePrefix": {
            "type": "string"
          },
          "receiptPrefix": {
            "type": "string"
          },
          "gatePassPrefix": {
            "type": "string"
          },
          "paymentModes": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "required": [
          "gstin",
          "bankAccountHolder",
          "bankName",
          "bankAccountNumber",
          "bankIfsc",
          "bankBranch",
          "upiId",
          "defaultGstPercent",
          "invoicePrefix",
          "receiptPrefix",
          "gatePassPrefix",
          "paymentModes"
        ],
        "additionalProperties": false
      },
      "D19": {
        "type": "object",
        "properties": {
          "defaultUnit": {
            "type": "string"
          },
          "lowStockNotifications": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "requireAdjustmentReason": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "defaultUnit",
          "lowStockNotifications",
          "requireAdjustmentReason"
        ],
        "additionalProperties": false
      },
      "D20": {
        "type": "object",
        "properties": {
          "customerChannels": {
            "type": "array",
            "items": {
              "anyOf": [
                {
                  "const": "sms"
                },
                {
                  "const": "email"
                },
                {
                  "const": "whatsapp"
                }
              ]
            }
          },
          "documentHeader": {
            "type": "string"
          },
          "estimateTemplate": {
            "type": "string"
          },
          "invoiceTemplate": {
            "type": "string"
          },
          "jobCardCreatedWhatsAppTemplate": {
            "type": "string"
          },
          "jobCardCreatedEmailTemplate": {
            "type": "string"
          },
          "jobCardClosedWhatsAppTemplate": {
            "type": "string"
          },
          "jobCardClosedEmailTemplate": {
            "type": "string"
          }
        },
        "required": [
          "customerChannels",
          "documentHeader",
          "estimateTemplate",
          "invoiceTemplate",
          "jobCardCreatedWhatsAppTemplate",
          "jobCardCreatedEmailTemplate",
          "jobCardClosedWhatsAppTemplate",
          "jobCardClosedEmailTemplate"
        ],
        "additionalProperties": false
      },
      "D21": {
        "type": "object",
        "properties": {
          "operationalDays": {
            "type": "number"
          },
          "featureDays": {
            "type": "number"
          }
        },
        "required": [
          "operationalDays",
          "featureDays"
        ],
        "additionalProperties": false
      },
      "D22": {
        "type": "object",
        "properties": {
          "fontId": {
            "anyOf": [
              {
                "const": "system"
              },
              {
                "const": "arial"
              },
              {
                "const": "verdana"
              },
              {
                "const": "trebuchet"
              },
              {
                "const": "georgia"
              }
            ]
          },
          "paletteId": {
            "anyOf": [
              {
                "const": "go-lite"
              },
              {
                "const": "go-yellow"
              },
              {
                "const": "go-orange"
              },
              {
                "const": "go-blue"
              }
            ]
          }
        },
        "required": [
          "fontId",
          "paletteId"
        ],
        "additionalProperties": false
      },
      "D23": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "stream": {
            "anyOf": [
              {
                "const": "operational"
              },
              {
                "const": "feature"
              }
            ]
          },
          "timestamp": {
            "type": "string"
          },
          "level": {
            "anyOf": [
              {
                "const": "info"
              },
              {
                "const": "warning"
              },
              {
                "const": "error"
              }
            ]
          },
          "area": {
            "type": "string"
          },
          "feature": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "userId": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "userName": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "referenceId": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "details": {
            "anyOf": [
              {
                "$ref": "#/$defs/D24"
              }
            ]
          }
        },
        "required": [
          "id",
          "stream",
          "timestamp",
          "level",
          "area",
          "feature",
          "message"
        ],
        "additionalProperties": false
      },
      "D24": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "x-unverified": "unknown"
        }
      },
      "D25": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "fileName": {
            "type": "string"
          },
          "status": {
            "anyOf": [
              {
                "const": "mapping"
              },
              {
                "const": "validated"
              },
              {
                "const": "imported"
              },
              {
                "const": "failed"
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "importedAt": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "totalRows": {
            "type": "number"
          },
          "acceptedRows": {
            "type": "number"
          },
          "rejectedRows": {
            "type": "number"
          },
          "columnMapping": {
            "$ref": "#/$defs/D26"
          },
          "errors": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D27"
            }
          }
        },
        "required": [
          "id",
          "fileName",
          "status",
          "createdAt",
          "totalRows",
          "acceptedRows",
          "rejectedRows",
          "columnMapping",
          "errors"
        ],
        "additionalProperties": false
      },
      "D26": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "type": "string"
        }
      },
      "D27": {
        "type": "object",
        "properties": {
          "row": {
            "type": "number"
          },
          "field": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "message": {
            "type": "string"
          }
        },
        "required": [
          "row",
          "message"
        ],
        "additionalProperties": false
      },
      "D28": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "importBatchId": {
            "type": "string"
          },
          "sku": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "category": {
            "type": "string"
          },
          "unit": {
            "type": "string"
          },
          "stockQty": {
            "type": "number"
          },
          "lowStockQty": {
            "type": "number"
          },
          "sellingPrice": {
            "type": "number"
          },
          "importedAt": {
            "type": "string"
          }
        },
        "required": [
          "id",
          "importBatchId",
          "sku",
          "name",
          "category",
          "unit",
          "stockQty",
          "lowStockQty",
          "sellingPrice",
          "importedAt"
        ],
        "additionalProperties": false
      },
      "D29": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "category": {
            "anyOf": [
              {
                "const": "job-card"
              },
              {
                "const": "estimate"
              },
              {
                "const": "invoice"
              },
              {
                "const": "quotation"
              },
              {
                "const": "gate-pass"
              },
              {
                "const": "payment-receipt"
              }
            ]
          },
          "name": {
            "type": "string"
          },
          "html": {
            "type": "string"
          },
          "active": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "updatedAt": {
            "type": "string"
          },
          "seedVersion": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [
          "id",
          "category",
          "name",
          "html",
          "active",
          "createdAt",
          "updatedAt"
        ],
        "additionalProperties": false
      },
      "D30": {
        "type": "object",
        "properties": {
          "logo": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          },
          "stamp": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          },
          "authorizedSignature": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "logo",
          "stamp",
          "authorizedSignature"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": [
      "unknown"
    ]
  },
  {
    "operation": "OP-admin-demo-state-updateAppTheme",
    "route": "POST /api/v1/ui/commands/updateAppTheme",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "appTheme": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "appTheme"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "$ref": "#/$defs/D2"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "fontId": {
            "anyOf": [
              {
                "const": "system"
              },
              {
                "const": "arial"
              },
              {
                "const": "verdana"
              },
              {
                "const": "trebuchet"
              },
              {
                "const": "georgia"
              }
            ]
          },
          "paletteId": {
            "anyOf": [
              {
                "const": "go-lite"
              },
              {
                "const": "go-yellow"
              },
              {
                "const": "go-orange"
              },
              {
                "const": "go-blue"
              }
            ]
          }
        },
        "required": [],
        "additionalProperties": false
      },
      "D2": {
        "type": "object",
        "properties": {
          "version": {
            "const": 2
          },
          "roles": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D3"
            }
          },
          "rolePageAccess": {
            "$ref": "#/$defs/D4"
          },
          "businessSettings": {
            "$ref": "#/$defs/D5"
          },
          "appTheme": {
            "$ref": "#/$defs/D14"
          },
          "logs": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D15"
            }
          },
          "importBatches": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D17"
            }
          },
          "sessionInventory": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D20"
            }
          },
          "reportTemplates": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D21"
            }
          },
          "companyAssets": {
            "$ref": "#/$defs/D22"
          }
        },
        "required": [
          "version",
          "roles",
          "rolePageAccess",
          "businessSettings",
          "appTheme",
          "logs",
          "importBatches",
          "sessionInventory",
          "reportTemplates",
          "companyAssets"
        ],
        "additionalProperties": false
      },
      "D3": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "label": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "systemRole": {
            "anyOf": [
              {
                "const": "admin"
              },
              {
                "const": "service"
              },
              {
                "const": "service_manager"
              },
              {
                "const": "reception"
              },
              {
                "const": "accounts"
              },
              {
                "const": "store"
              },
              {
                "const": "tech"
              }
            ]
          },
          "isBuiltIn": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "status": {
            "anyOf": [
              {
                "const": "active"
              },
              {
                "const": "archived"
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "updatedAt": {
            "type": "string"
          },
          "archivedAt": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "id",
          "label",
          "description",
          "isBuiltIn",
          "status",
          "createdAt",
          "updatedAt"
        ],
        "additionalProperties": false
      },
      "D4": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "type": "array",
          "items": {
            "anyOf": [
              {
                "const": "receive-vehicle"
              },
              {
                "const": "advance-bookings"
              },
              {
                "const": "today-queue"
              },
              {
                "const": "customers"
              },
              {
                "const": "vehicles"
              },
              {
                "const": "search"
              },
              {
                "const": "my-queue"
              },
              {
                "const": "job-card"
              },
              {
                "const": "estimate"
              },
              {
                "const": "follow-ups"
              },
              {
                "const": "media"
              },
              {
                "const": "material-requests"
              },
              {
                "const": "issue-material"
              },
              {
                "const": "reconcile"
              },
              {
                "const": "stock"
              },
              {
                "const": "approvals"
              },
              {
                "const": "inward-purchases"
              },
              {
                "const": "my-tasks"
              },
              {
                "const": "work-update"
              },
              {
                "const": "qc-prep"
              },
              {
                "const": "ready-to-invoice"
              },
              {
                "const": "invoice"
              },
              {
                "const": "payment"
              },
              {
                "const": "delivery"
              },
              {
                "const": "dashboard"
              },
              {
                "const": "data-flow"
              },
              {
                "const": "jobs"
              },
              {
                "const": "manage"
              },
              {
                "const": "admin-console"
              },
              {
                "const": "sales-leads"
              },
              {
                "const": "quotations"
              },
              {
                "const": "quotation-settings"
              }
            ]
          }
        }
      },
      "D5": {
        "type": "object",
        "properties": {
          "profile": {
            "$ref": "#/$defs/D6"
          },
          "branch": {
            "$ref": "#/$defs/D7"
          },
          "jobs": {
            "$ref": "#/$defs/D8"
          },
          "pricing": {
            "$ref": "#/$defs/D9"
          },
          "billing": {
            "$ref": "#/$defs/D10"
          },
          "inventory": {
            "$ref": "#/$defs/D11"
          },
          "notifications": {
            "$ref": "#/$defs/D12"
          },
          "logRetention": {
            "$ref": "#/$defs/D13"
          }
        },
        "required": [
          "profile",
          "branch",
          "jobs",
          "pricing",
          "billing",
          "inventory",
          "notifications",
          "logRetention"
        ],
        "additionalProperties": false
      },
      "D6": {
        "type": "object",
        "properties": {
          "businessName": {
            "type": "string"
          },
          "legalName": {
            "type": "string"
          },
          "phone": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "address": {
            "type": "string"
          },
          "footer": {
            "type": "string"
          },
          "timezone": {
            "type": "string"
          },
          "currency": {
            "type": "string"
          }
        },
        "required": [
          "businessName",
          "legalName",
          "phone",
          "email",
          "address",
          "footer",
          "timezone",
          "currency"
        ],
        "additionalProperties": false
      },
      "D7": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "openingTime": {
            "type": "string"
          },
          "closingTime": {
            "type": "string"
          },
          "workingDays": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "holidayBehavior": {
            "anyOf": [
              {
                "const": "closed"
              },
              {
                "const": "appointment-only"
              }
            ]
          }
        },
        "required": [
          "name",
          "openingTime",
          "closingTime",
          "workingDays",
          "holidayBehavior"
        ],
        "additionalProperties": false
      },
      "D8": {
        "type": "object",
        "properties": {
          "jobNumberPrefix": {
            "type": "string"
          },
          "defaultPromisedHours": {
            "type": "number"
          },
          "requireQc": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "washingDefault": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "autoCloseAfterDelivery": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "jobNumberPrefix",
          "defaultPromisedHours",
          "requireQc",
          "washingDefault",
          "autoCloseAfterDelivery"
        ],
        "additionalProperties": false
      },
      "D9": {
        "type": "object",
        "properties": {
          "estimateValidityDays": {
            "type": "number"
          },
          "defaultLabourRate": {
            "type": "number"
          },
          "discountApprovalPercent": {
            "type": "number"
          },
          "requireEstimateApproval": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "estimateValidityDays",
          "defaultLabourRate",
          "discountApprovalPercent",
          "requireEstimateApproval"
        ],
        "additionalProperties": false
      },
      "D10": {
        "type": "object",
        "properties": {
          "gstin": {
            "type": "string"
          },
          "bankAccountHolder": {
            "type": "string"
          },
          "bankName": {
            "type": "string"
          },
          "bankAccountNumber": {
            "type": "string"
          },
          "bankIfsc": {
            "type": "string"
          },
          "bankBranch": {
            "type": "string"
          },
          "upiId": {
            "type": "string"
          },
          "defaultGstPercent": {
            "type": "number"
          },
          "invoicePrefix": {
            "type": "string"
          },
          "receiptPrefix": {
            "type": "string"
          },
          "gatePassPrefix": {
            "type": "string"
          },
          "paymentModes": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "required": [
          "gstin",
          "bankAccountHolder",
          "bankName",
          "bankAccountNumber",
          "bankIfsc",
          "bankBranch",
          "upiId",
          "defaultGstPercent",
          "invoicePrefix",
          "receiptPrefix",
          "gatePassPrefix",
          "paymentModes"
        ],
        "additionalProperties": false
      },
      "D11": {
        "type": "object",
        "properties": {
          "defaultUnit": {
            "type": "string"
          },
          "lowStockNotifications": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "requireAdjustmentReason": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "defaultUnit",
          "lowStockNotifications",
          "requireAdjustmentReason"
        ],
        "additionalProperties": false
      },
      "D12": {
        "type": "object",
        "properties": {
          "customerChannels": {
            "type": "array",
            "items": {
              "anyOf": [
                {
                  "const": "sms"
                },
                {
                  "const": "email"
                },
                {
                  "const": "whatsapp"
                }
              ]
            }
          },
          "documentHeader": {
            "type": "string"
          },
          "estimateTemplate": {
            "type": "string"
          },
          "invoiceTemplate": {
            "type": "string"
          },
          "jobCardCreatedWhatsAppTemplate": {
            "type": "string"
          },
          "jobCardCreatedEmailTemplate": {
            "type": "string"
          },
          "jobCardClosedWhatsAppTemplate": {
            "type": "string"
          },
          "jobCardClosedEmailTemplate": {
            "type": "string"
          }
        },
        "required": [
          "customerChannels",
          "documentHeader",
          "estimateTemplate",
          "invoiceTemplate",
          "jobCardCreatedWhatsAppTemplate",
          "jobCardCreatedEmailTemplate",
          "jobCardClosedWhatsAppTemplate",
          "jobCardClosedEmailTemplate"
        ],
        "additionalProperties": false
      },
      "D13": {
        "type": "object",
        "properties": {
          "operationalDays": {
            "type": "number"
          },
          "featureDays": {
            "type": "number"
          }
        },
        "required": [
          "operationalDays",
          "featureDays"
        ],
        "additionalProperties": false
      },
      "D14": {
        "type": "object",
        "properties": {
          "fontId": {
            "anyOf": [
              {
                "const": "system"
              },
              {
                "const": "arial"
              },
              {
                "const": "verdana"
              },
              {
                "const": "trebuchet"
              },
              {
                "const": "georgia"
              }
            ]
          },
          "paletteId": {
            "anyOf": [
              {
                "const": "go-lite"
              },
              {
                "const": "go-yellow"
              },
              {
                "const": "go-orange"
              },
              {
                "const": "go-blue"
              }
            ]
          }
        },
        "required": [
          "fontId",
          "paletteId"
        ],
        "additionalProperties": false
      },
      "D15": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "stream": {
            "anyOf": [
              {
                "const": "operational"
              },
              {
                "const": "feature"
              }
            ]
          },
          "timestamp": {
            "type": "string"
          },
          "level": {
            "anyOf": [
              {
                "const": "info"
              },
              {
                "const": "warning"
              },
              {
                "const": "error"
              }
            ]
          },
          "area": {
            "type": "string"
          },
          "feature": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "userId": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "userName": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "referenceId": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "details": {
            "anyOf": [
              {
                "$ref": "#/$defs/D16"
              }
            ]
          }
        },
        "required": [
          "id",
          "stream",
          "timestamp",
          "level",
          "area",
          "feature",
          "message"
        ],
        "additionalProperties": false
      },
      "D16": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "x-unverified": "unknown"
        }
      },
      "D17": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "fileName": {
            "type": "string"
          },
          "status": {
            "anyOf": [
              {
                "const": "mapping"
              },
              {
                "const": "validated"
              },
              {
                "const": "imported"
              },
              {
                "const": "failed"
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "importedAt": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "totalRows": {
            "type": "number"
          },
          "acceptedRows": {
            "type": "number"
          },
          "rejectedRows": {
            "type": "number"
          },
          "columnMapping": {
            "$ref": "#/$defs/D18"
          },
          "errors": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D19"
            }
          }
        },
        "required": [
          "id",
          "fileName",
          "status",
          "createdAt",
          "totalRows",
          "acceptedRows",
          "rejectedRows",
          "columnMapping",
          "errors"
        ],
        "additionalProperties": false
      },
      "D18": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "type": "string"
        }
      },
      "D19": {
        "type": "object",
        "properties": {
          "row": {
            "type": "number"
          },
          "field": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "message": {
            "type": "string"
          }
        },
        "required": [
          "row",
          "message"
        ],
        "additionalProperties": false
      },
      "D20": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "importBatchId": {
            "type": "string"
          },
          "sku": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "category": {
            "type": "string"
          },
          "unit": {
            "type": "string"
          },
          "stockQty": {
            "type": "number"
          },
          "lowStockQty": {
            "type": "number"
          },
          "sellingPrice": {
            "type": "number"
          },
          "importedAt": {
            "type": "string"
          }
        },
        "required": [
          "id",
          "importBatchId",
          "sku",
          "name",
          "category",
          "unit",
          "stockQty",
          "lowStockQty",
          "sellingPrice",
          "importedAt"
        ],
        "additionalProperties": false
      },
      "D21": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "category": {
            "anyOf": [
              {
                "const": "job-card"
              },
              {
                "const": "estimate"
              },
              {
                "const": "invoice"
              },
              {
                "const": "quotation"
              },
              {
                "const": "gate-pass"
              },
              {
                "const": "payment-receipt"
              }
            ]
          },
          "name": {
            "type": "string"
          },
          "html": {
            "type": "string"
          },
          "active": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "updatedAt": {
            "type": "string"
          },
          "seedVersion": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [
          "id",
          "category",
          "name",
          "html",
          "active",
          "createdAt",
          "updatedAt"
        ],
        "additionalProperties": false
      },
      "D22": {
        "type": "object",
        "properties": {
          "logo": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          },
          "stamp": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          },
          "authorizedSignature": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "logo",
          "stamp",
          "authorizedSignature"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": [
      "unknown"
    ]
  },
  {
    "operation": "OP-admin-demo-state-createReportTemplate",
    "route": "POST /api/v1/ui/commands/createReportTemplate",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "$ref": "#/$defs/D2"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "category": {
            "anyOf": [
              {
                "const": "job-card"
              },
              {
                "const": "estimate"
              },
              {
                "const": "invoice"
              },
              {
                "const": "quotation"
              },
              {
                "const": "gate-pass"
              },
              {
                "const": "payment-receipt"
              }
            ]
          },
          "name": {
            "type": "string"
          },
          "html": {
            "type": "string"
          },
          "active": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "category",
          "name",
          "html"
        ],
        "additionalProperties": false
      },
      "D2": {
        "type": "object",
        "properties": {
          "version": {
            "const": 2
          },
          "roles": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D3"
            }
          },
          "rolePageAccess": {
            "$ref": "#/$defs/D4"
          },
          "businessSettings": {
            "$ref": "#/$defs/D5"
          },
          "appTheme": {
            "$ref": "#/$defs/D14"
          },
          "logs": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D15"
            }
          },
          "importBatches": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D17"
            }
          },
          "sessionInventory": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D20"
            }
          },
          "reportTemplates": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D21"
            }
          },
          "companyAssets": {
            "$ref": "#/$defs/D22"
          }
        },
        "required": [
          "version",
          "roles",
          "rolePageAccess",
          "businessSettings",
          "appTheme",
          "logs",
          "importBatches",
          "sessionInventory",
          "reportTemplates",
          "companyAssets"
        ],
        "additionalProperties": false
      },
      "D3": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "label": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "systemRole": {
            "anyOf": [
              {
                "const": "admin"
              },
              {
                "const": "service"
              },
              {
                "const": "service_manager"
              },
              {
                "const": "reception"
              },
              {
                "const": "accounts"
              },
              {
                "const": "store"
              },
              {
                "const": "tech"
              }
            ]
          },
          "isBuiltIn": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "status": {
            "anyOf": [
              {
                "const": "active"
              },
              {
                "const": "archived"
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "updatedAt": {
            "type": "string"
          },
          "archivedAt": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "id",
          "label",
          "description",
          "isBuiltIn",
          "status",
          "createdAt",
          "updatedAt"
        ],
        "additionalProperties": false
      },
      "D4": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "type": "array",
          "items": {
            "anyOf": [
              {
                "const": "receive-vehicle"
              },
              {
                "const": "advance-bookings"
              },
              {
                "const": "today-queue"
              },
              {
                "const": "customers"
              },
              {
                "const": "vehicles"
              },
              {
                "const": "search"
              },
              {
                "const": "my-queue"
              },
              {
                "const": "job-card"
              },
              {
                "const": "estimate"
              },
              {
                "const": "follow-ups"
              },
              {
                "const": "media"
              },
              {
                "const": "material-requests"
              },
              {
                "const": "issue-material"
              },
              {
                "const": "reconcile"
              },
              {
                "const": "stock"
              },
              {
                "const": "approvals"
              },
              {
                "const": "inward-purchases"
              },
              {
                "const": "my-tasks"
              },
              {
                "const": "work-update"
              },
              {
                "const": "qc-prep"
              },
              {
                "const": "ready-to-invoice"
              },
              {
                "const": "invoice"
              },
              {
                "const": "payment"
              },
              {
                "const": "delivery"
              },
              {
                "const": "dashboard"
              },
              {
                "const": "data-flow"
              },
              {
                "const": "jobs"
              },
              {
                "const": "manage"
              },
              {
                "const": "admin-console"
              },
              {
                "const": "sales-leads"
              },
              {
                "const": "quotations"
              },
              {
                "const": "quotation-settings"
              }
            ]
          }
        }
      },
      "D5": {
        "type": "object",
        "properties": {
          "profile": {
            "$ref": "#/$defs/D6"
          },
          "branch": {
            "$ref": "#/$defs/D7"
          },
          "jobs": {
            "$ref": "#/$defs/D8"
          },
          "pricing": {
            "$ref": "#/$defs/D9"
          },
          "billing": {
            "$ref": "#/$defs/D10"
          },
          "inventory": {
            "$ref": "#/$defs/D11"
          },
          "notifications": {
            "$ref": "#/$defs/D12"
          },
          "logRetention": {
            "$ref": "#/$defs/D13"
          }
        },
        "required": [
          "profile",
          "branch",
          "jobs",
          "pricing",
          "billing",
          "inventory",
          "notifications",
          "logRetention"
        ],
        "additionalProperties": false
      },
      "D6": {
        "type": "object",
        "properties": {
          "businessName": {
            "type": "string"
          },
          "legalName": {
            "type": "string"
          },
          "phone": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "address": {
            "type": "string"
          },
          "footer": {
            "type": "string"
          },
          "timezone": {
            "type": "string"
          },
          "currency": {
            "type": "string"
          }
        },
        "required": [
          "businessName",
          "legalName",
          "phone",
          "email",
          "address",
          "footer",
          "timezone",
          "currency"
        ],
        "additionalProperties": false
      },
      "D7": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "openingTime": {
            "type": "string"
          },
          "closingTime": {
            "type": "string"
          },
          "workingDays": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "holidayBehavior": {
            "anyOf": [
              {
                "const": "closed"
              },
              {
                "const": "appointment-only"
              }
            ]
          }
        },
        "required": [
          "name",
          "openingTime",
          "closingTime",
          "workingDays",
          "holidayBehavior"
        ],
        "additionalProperties": false
      },
      "D8": {
        "type": "object",
        "properties": {
          "jobNumberPrefix": {
            "type": "string"
          },
          "defaultPromisedHours": {
            "type": "number"
          },
          "requireQc": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "washingDefault": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "autoCloseAfterDelivery": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "jobNumberPrefix",
          "defaultPromisedHours",
          "requireQc",
          "washingDefault",
          "autoCloseAfterDelivery"
        ],
        "additionalProperties": false
      },
      "D9": {
        "type": "object",
        "properties": {
          "estimateValidityDays": {
            "type": "number"
          },
          "defaultLabourRate": {
            "type": "number"
          },
          "discountApprovalPercent": {
            "type": "number"
          },
          "requireEstimateApproval": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "estimateValidityDays",
          "defaultLabourRate",
          "discountApprovalPercent",
          "requireEstimateApproval"
        ],
        "additionalProperties": false
      },
      "D10": {
        "type": "object",
        "properties": {
          "gstin": {
            "type": "string"
          },
          "bankAccountHolder": {
            "type": "string"
          },
          "bankName": {
            "type": "string"
          },
          "bankAccountNumber": {
            "type": "string"
          },
          "bankIfsc": {
            "type": "string"
          },
          "bankBranch": {
            "type": "string"
          },
          "upiId": {
            "type": "string"
          },
          "defaultGstPercent": {
            "type": "number"
          },
          "invoicePrefix": {
            "type": "string"
          },
          "receiptPrefix": {
            "type": "string"
          },
          "gatePassPrefix": {
            "type": "string"
          },
          "paymentModes": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "required": [
          "gstin",
          "bankAccountHolder",
          "bankName",
          "bankAccountNumber",
          "bankIfsc",
          "bankBranch",
          "upiId",
          "defaultGstPercent",
          "invoicePrefix",
          "receiptPrefix",
          "gatePassPrefix",
          "paymentModes"
        ],
        "additionalProperties": false
      },
      "D11": {
        "type": "object",
        "properties": {
          "defaultUnit": {
            "type": "string"
          },
          "lowStockNotifications": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "requireAdjustmentReason": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "defaultUnit",
          "lowStockNotifications",
          "requireAdjustmentReason"
        ],
        "additionalProperties": false
      },
      "D12": {
        "type": "object",
        "properties": {
          "customerChannels": {
            "type": "array",
            "items": {
              "anyOf": [
                {
                  "const": "sms"
                },
                {
                  "const": "email"
                },
                {
                  "const": "whatsapp"
                }
              ]
            }
          },
          "documentHeader": {
            "type": "string"
          },
          "estimateTemplate": {
            "type": "string"
          },
          "invoiceTemplate": {
            "type": "string"
          },
          "jobCardCreatedWhatsAppTemplate": {
            "type": "string"
          },
          "jobCardCreatedEmailTemplate": {
            "type": "string"
          },
          "jobCardClosedWhatsAppTemplate": {
            "type": "string"
          },
          "jobCardClosedEmailTemplate": {
            "type": "string"
          }
        },
        "required": [
          "customerChannels",
          "documentHeader",
          "estimateTemplate",
          "invoiceTemplate",
          "jobCardCreatedWhatsAppTemplate",
          "jobCardCreatedEmailTemplate",
          "jobCardClosedWhatsAppTemplate",
          "jobCardClosedEmailTemplate"
        ],
        "additionalProperties": false
      },
      "D13": {
        "type": "object",
        "properties": {
          "operationalDays": {
            "type": "number"
          },
          "featureDays": {
            "type": "number"
          }
        },
        "required": [
          "operationalDays",
          "featureDays"
        ],
        "additionalProperties": false
      },
      "D14": {
        "type": "object",
        "properties": {
          "fontId": {
            "anyOf": [
              {
                "const": "system"
              },
              {
                "const": "arial"
              },
              {
                "const": "verdana"
              },
              {
                "const": "trebuchet"
              },
              {
                "const": "georgia"
              }
            ]
          },
          "paletteId": {
            "anyOf": [
              {
                "const": "go-lite"
              },
              {
                "const": "go-yellow"
              },
              {
                "const": "go-orange"
              },
              {
                "const": "go-blue"
              }
            ]
          }
        },
        "required": [
          "fontId",
          "paletteId"
        ],
        "additionalProperties": false
      },
      "D15": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "stream": {
            "anyOf": [
              {
                "const": "operational"
              },
              {
                "const": "feature"
              }
            ]
          },
          "timestamp": {
            "type": "string"
          },
          "level": {
            "anyOf": [
              {
                "const": "info"
              },
              {
                "const": "warning"
              },
              {
                "const": "error"
              }
            ]
          },
          "area": {
            "type": "string"
          },
          "feature": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "userId": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "userName": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "referenceId": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "details": {
            "anyOf": [
              {
                "$ref": "#/$defs/D16"
              }
            ]
          }
        },
        "required": [
          "id",
          "stream",
          "timestamp",
          "level",
          "area",
          "feature",
          "message"
        ],
        "additionalProperties": false
      },
      "D16": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "x-unverified": "unknown"
        }
      },
      "D17": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "fileName": {
            "type": "string"
          },
          "status": {
            "anyOf": [
              {
                "const": "mapping"
              },
              {
                "const": "validated"
              },
              {
                "const": "imported"
              },
              {
                "const": "failed"
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "importedAt": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "totalRows": {
            "type": "number"
          },
          "acceptedRows": {
            "type": "number"
          },
          "rejectedRows": {
            "type": "number"
          },
          "columnMapping": {
            "$ref": "#/$defs/D18"
          },
          "errors": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D19"
            }
          }
        },
        "required": [
          "id",
          "fileName",
          "status",
          "createdAt",
          "totalRows",
          "acceptedRows",
          "rejectedRows",
          "columnMapping",
          "errors"
        ],
        "additionalProperties": false
      },
      "D18": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "type": "string"
        }
      },
      "D19": {
        "type": "object",
        "properties": {
          "row": {
            "type": "number"
          },
          "field": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "message": {
            "type": "string"
          }
        },
        "required": [
          "row",
          "message"
        ],
        "additionalProperties": false
      },
      "D20": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "importBatchId": {
            "type": "string"
          },
          "sku": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "category": {
            "type": "string"
          },
          "unit": {
            "type": "string"
          },
          "stockQty": {
            "type": "number"
          },
          "lowStockQty": {
            "type": "number"
          },
          "sellingPrice": {
            "type": "number"
          },
          "importedAt": {
            "type": "string"
          }
        },
        "required": [
          "id",
          "importBatchId",
          "sku",
          "name",
          "category",
          "unit",
          "stockQty",
          "lowStockQty",
          "sellingPrice",
          "importedAt"
        ],
        "additionalProperties": false
      },
      "D21": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "category": {
            "anyOf": [
              {
                "const": "job-card"
              },
              {
                "const": "estimate"
              },
              {
                "const": "invoice"
              },
              {
                "const": "quotation"
              },
              {
                "const": "gate-pass"
              },
              {
                "const": "payment-receipt"
              }
            ]
          },
          "name": {
            "type": "string"
          },
          "html": {
            "type": "string"
          },
          "active": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "updatedAt": {
            "type": "string"
          },
          "seedVersion": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [
          "id",
          "category",
          "name",
          "html",
          "active",
          "createdAt",
          "updatedAt"
        ],
        "additionalProperties": false
      },
      "D22": {
        "type": "object",
        "properties": {
          "logo": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          },
          "stamp": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          },
          "authorizedSignature": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "logo",
          "stamp",
          "authorizedSignature"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": [
      "unknown"
    ]
  },
  {
    "operation": "OP-admin-demo-state-updateReportTemplate",
    "route": "POST /api/v1/ui/commands/updateReportTemplate",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "templateId": {
              "type": "string"
            },
            "updates": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "templateId",
            "updates"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "$ref": "#/$defs/D2"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "name": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "html": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "active": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [],
        "additionalProperties": false
      },
      "D2": {
        "type": "object",
        "properties": {
          "version": {
            "const": 2
          },
          "roles": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D3"
            }
          },
          "rolePageAccess": {
            "$ref": "#/$defs/D4"
          },
          "businessSettings": {
            "$ref": "#/$defs/D5"
          },
          "appTheme": {
            "$ref": "#/$defs/D14"
          },
          "logs": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D15"
            }
          },
          "importBatches": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D17"
            }
          },
          "sessionInventory": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D20"
            }
          },
          "reportTemplates": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D21"
            }
          },
          "companyAssets": {
            "$ref": "#/$defs/D22"
          }
        },
        "required": [
          "version",
          "roles",
          "rolePageAccess",
          "businessSettings",
          "appTheme",
          "logs",
          "importBatches",
          "sessionInventory",
          "reportTemplates",
          "companyAssets"
        ],
        "additionalProperties": false
      },
      "D3": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "label": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "systemRole": {
            "anyOf": [
              {
                "const": "admin"
              },
              {
                "const": "service"
              },
              {
                "const": "service_manager"
              },
              {
                "const": "reception"
              },
              {
                "const": "accounts"
              },
              {
                "const": "store"
              },
              {
                "const": "tech"
              }
            ]
          },
          "isBuiltIn": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "status": {
            "anyOf": [
              {
                "const": "active"
              },
              {
                "const": "archived"
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "updatedAt": {
            "type": "string"
          },
          "archivedAt": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "id",
          "label",
          "description",
          "isBuiltIn",
          "status",
          "createdAt",
          "updatedAt"
        ],
        "additionalProperties": false
      },
      "D4": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "type": "array",
          "items": {
            "anyOf": [
              {
                "const": "receive-vehicle"
              },
              {
                "const": "advance-bookings"
              },
              {
                "const": "today-queue"
              },
              {
                "const": "customers"
              },
              {
                "const": "vehicles"
              },
              {
                "const": "search"
              },
              {
                "const": "my-queue"
              },
              {
                "const": "job-card"
              },
              {
                "const": "estimate"
              },
              {
                "const": "follow-ups"
              },
              {
                "const": "media"
              },
              {
                "const": "material-requests"
              },
              {
                "const": "issue-material"
              },
              {
                "const": "reconcile"
              },
              {
                "const": "stock"
              },
              {
                "const": "approvals"
              },
              {
                "const": "inward-purchases"
              },
              {
                "const": "my-tasks"
              },
              {
                "const": "work-update"
              },
              {
                "const": "qc-prep"
              },
              {
                "const": "ready-to-invoice"
              },
              {
                "const": "invoice"
              },
              {
                "const": "payment"
              },
              {
                "const": "delivery"
              },
              {
                "const": "dashboard"
              },
              {
                "const": "data-flow"
              },
              {
                "const": "jobs"
              },
              {
                "const": "manage"
              },
              {
                "const": "admin-console"
              },
              {
                "const": "sales-leads"
              },
              {
                "const": "quotations"
              },
              {
                "const": "quotation-settings"
              }
            ]
          }
        }
      },
      "D5": {
        "type": "object",
        "properties": {
          "profile": {
            "$ref": "#/$defs/D6"
          },
          "branch": {
            "$ref": "#/$defs/D7"
          },
          "jobs": {
            "$ref": "#/$defs/D8"
          },
          "pricing": {
            "$ref": "#/$defs/D9"
          },
          "billing": {
            "$ref": "#/$defs/D10"
          },
          "inventory": {
            "$ref": "#/$defs/D11"
          },
          "notifications": {
            "$ref": "#/$defs/D12"
          },
          "logRetention": {
            "$ref": "#/$defs/D13"
          }
        },
        "required": [
          "profile",
          "branch",
          "jobs",
          "pricing",
          "billing",
          "inventory",
          "notifications",
          "logRetention"
        ],
        "additionalProperties": false
      },
      "D6": {
        "type": "object",
        "properties": {
          "businessName": {
            "type": "string"
          },
          "legalName": {
            "type": "string"
          },
          "phone": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "address": {
            "type": "string"
          },
          "footer": {
            "type": "string"
          },
          "timezone": {
            "type": "string"
          },
          "currency": {
            "type": "string"
          }
        },
        "required": [
          "businessName",
          "legalName",
          "phone",
          "email",
          "address",
          "footer",
          "timezone",
          "currency"
        ],
        "additionalProperties": false
      },
      "D7": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "openingTime": {
            "type": "string"
          },
          "closingTime": {
            "type": "string"
          },
          "workingDays": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "holidayBehavior": {
            "anyOf": [
              {
                "const": "closed"
              },
              {
                "const": "appointment-only"
              }
            ]
          }
        },
        "required": [
          "name",
          "openingTime",
          "closingTime",
          "workingDays",
          "holidayBehavior"
        ],
        "additionalProperties": false
      },
      "D8": {
        "type": "object",
        "properties": {
          "jobNumberPrefix": {
            "type": "string"
          },
          "defaultPromisedHours": {
            "type": "number"
          },
          "requireQc": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "washingDefault": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "autoCloseAfterDelivery": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "jobNumberPrefix",
          "defaultPromisedHours",
          "requireQc",
          "washingDefault",
          "autoCloseAfterDelivery"
        ],
        "additionalProperties": false
      },
      "D9": {
        "type": "object",
        "properties": {
          "estimateValidityDays": {
            "type": "number"
          },
          "defaultLabourRate": {
            "type": "number"
          },
          "discountApprovalPercent": {
            "type": "number"
          },
          "requireEstimateApproval": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "estimateValidityDays",
          "defaultLabourRate",
          "discountApprovalPercent",
          "requireEstimateApproval"
        ],
        "additionalProperties": false
      },
      "D10": {
        "type": "object",
        "properties": {
          "gstin": {
            "type": "string"
          },
          "bankAccountHolder": {
            "type": "string"
          },
          "bankName": {
            "type": "string"
          },
          "bankAccountNumber": {
            "type": "string"
          },
          "bankIfsc": {
            "type": "string"
          },
          "bankBranch": {
            "type": "string"
          },
          "upiId": {
            "type": "string"
          },
          "defaultGstPercent": {
            "type": "number"
          },
          "invoicePrefix": {
            "type": "string"
          },
          "receiptPrefix": {
            "type": "string"
          },
          "gatePassPrefix": {
            "type": "string"
          },
          "paymentModes": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "required": [
          "gstin",
          "bankAccountHolder",
          "bankName",
          "bankAccountNumber",
          "bankIfsc",
          "bankBranch",
          "upiId",
          "defaultGstPercent",
          "invoicePrefix",
          "receiptPrefix",
          "gatePassPrefix",
          "paymentModes"
        ],
        "additionalProperties": false
      },
      "D11": {
        "type": "object",
        "properties": {
          "defaultUnit": {
            "type": "string"
          },
          "lowStockNotifications": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "requireAdjustmentReason": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "defaultUnit",
          "lowStockNotifications",
          "requireAdjustmentReason"
        ],
        "additionalProperties": false
      },
      "D12": {
        "type": "object",
        "properties": {
          "customerChannels": {
            "type": "array",
            "items": {
              "anyOf": [
                {
                  "const": "sms"
                },
                {
                  "const": "email"
                },
                {
                  "const": "whatsapp"
                }
              ]
            }
          },
          "documentHeader": {
            "type": "string"
          },
          "estimateTemplate": {
            "type": "string"
          },
          "invoiceTemplate": {
            "type": "string"
          },
          "jobCardCreatedWhatsAppTemplate": {
            "type": "string"
          },
          "jobCardCreatedEmailTemplate": {
            "type": "string"
          },
          "jobCardClosedWhatsAppTemplate": {
            "type": "string"
          },
          "jobCardClosedEmailTemplate": {
            "type": "string"
          }
        },
        "required": [
          "customerChannels",
          "documentHeader",
          "estimateTemplate",
          "invoiceTemplate",
          "jobCardCreatedWhatsAppTemplate",
          "jobCardCreatedEmailTemplate",
          "jobCardClosedWhatsAppTemplate",
          "jobCardClosedEmailTemplate"
        ],
        "additionalProperties": false
      },
      "D13": {
        "type": "object",
        "properties": {
          "operationalDays": {
            "type": "number"
          },
          "featureDays": {
            "type": "number"
          }
        },
        "required": [
          "operationalDays",
          "featureDays"
        ],
        "additionalProperties": false
      },
      "D14": {
        "type": "object",
        "properties": {
          "fontId": {
            "anyOf": [
              {
                "const": "system"
              },
              {
                "const": "arial"
              },
              {
                "const": "verdana"
              },
              {
                "const": "trebuchet"
              },
              {
                "const": "georgia"
              }
            ]
          },
          "paletteId": {
            "anyOf": [
              {
                "const": "go-lite"
              },
              {
                "const": "go-yellow"
              },
              {
                "const": "go-orange"
              },
              {
                "const": "go-blue"
              }
            ]
          }
        },
        "required": [
          "fontId",
          "paletteId"
        ],
        "additionalProperties": false
      },
      "D15": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "stream": {
            "anyOf": [
              {
                "const": "operational"
              },
              {
                "const": "feature"
              }
            ]
          },
          "timestamp": {
            "type": "string"
          },
          "level": {
            "anyOf": [
              {
                "const": "info"
              },
              {
                "const": "warning"
              },
              {
                "const": "error"
              }
            ]
          },
          "area": {
            "type": "string"
          },
          "feature": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "userId": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "userName": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "referenceId": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "details": {
            "anyOf": [
              {
                "$ref": "#/$defs/D16"
              }
            ]
          }
        },
        "required": [
          "id",
          "stream",
          "timestamp",
          "level",
          "area",
          "feature",
          "message"
        ],
        "additionalProperties": false
      },
      "D16": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "x-unverified": "unknown"
        }
      },
      "D17": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "fileName": {
            "type": "string"
          },
          "status": {
            "anyOf": [
              {
                "const": "mapping"
              },
              {
                "const": "validated"
              },
              {
                "const": "imported"
              },
              {
                "const": "failed"
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "importedAt": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "totalRows": {
            "type": "number"
          },
          "acceptedRows": {
            "type": "number"
          },
          "rejectedRows": {
            "type": "number"
          },
          "columnMapping": {
            "$ref": "#/$defs/D18"
          },
          "errors": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D19"
            }
          }
        },
        "required": [
          "id",
          "fileName",
          "status",
          "createdAt",
          "totalRows",
          "acceptedRows",
          "rejectedRows",
          "columnMapping",
          "errors"
        ],
        "additionalProperties": false
      },
      "D18": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "type": "string"
        }
      },
      "D19": {
        "type": "object",
        "properties": {
          "row": {
            "type": "number"
          },
          "field": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "message": {
            "type": "string"
          }
        },
        "required": [
          "row",
          "message"
        ],
        "additionalProperties": false
      },
      "D20": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "importBatchId": {
            "type": "string"
          },
          "sku": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "category": {
            "type": "string"
          },
          "unit": {
            "type": "string"
          },
          "stockQty": {
            "type": "number"
          },
          "lowStockQty": {
            "type": "number"
          },
          "sellingPrice": {
            "type": "number"
          },
          "importedAt": {
            "type": "string"
          }
        },
        "required": [
          "id",
          "importBatchId",
          "sku",
          "name",
          "category",
          "unit",
          "stockQty",
          "lowStockQty",
          "sellingPrice",
          "importedAt"
        ],
        "additionalProperties": false
      },
      "D21": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "category": {
            "anyOf": [
              {
                "const": "job-card"
              },
              {
                "const": "estimate"
              },
              {
                "const": "invoice"
              },
              {
                "const": "quotation"
              },
              {
                "const": "gate-pass"
              },
              {
                "const": "payment-receipt"
              }
            ]
          },
          "name": {
            "type": "string"
          },
          "html": {
            "type": "string"
          },
          "active": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "updatedAt": {
            "type": "string"
          },
          "seedVersion": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [
          "id",
          "category",
          "name",
          "html",
          "active",
          "createdAt",
          "updatedAt"
        ],
        "additionalProperties": false
      },
      "D22": {
        "type": "object",
        "properties": {
          "logo": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          },
          "stamp": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          },
          "authorizedSignature": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "logo",
          "stamp",
          "authorizedSignature"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": [
      "unknown"
    ]
  },
  {
    "operation": "OP-admin-demo-state-activateReportTemplate",
    "route": "POST /api/v1/ui/commands/activateReportTemplate",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "templateId": {
              "type": "string"
            }
          },
          "required": [
            "templateId"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "$ref": "#/$defs/D1"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "version": {
            "const": 2
          },
          "roles": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D2"
            }
          },
          "rolePageAccess": {
            "$ref": "#/$defs/D3"
          },
          "businessSettings": {
            "$ref": "#/$defs/D4"
          },
          "appTheme": {
            "$ref": "#/$defs/D13"
          },
          "logs": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D14"
            }
          },
          "importBatches": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D16"
            }
          },
          "sessionInventory": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D19"
            }
          },
          "reportTemplates": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D20"
            }
          },
          "companyAssets": {
            "$ref": "#/$defs/D21"
          }
        },
        "required": [
          "version",
          "roles",
          "rolePageAccess",
          "businessSettings",
          "appTheme",
          "logs",
          "importBatches",
          "sessionInventory",
          "reportTemplates",
          "companyAssets"
        ],
        "additionalProperties": false
      },
      "D2": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "label": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "systemRole": {
            "anyOf": [
              {
                "const": "admin"
              },
              {
                "const": "service"
              },
              {
                "const": "service_manager"
              },
              {
                "const": "reception"
              },
              {
                "const": "accounts"
              },
              {
                "const": "store"
              },
              {
                "const": "tech"
              }
            ]
          },
          "isBuiltIn": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "status": {
            "anyOf": [
              {
                "const": "active"
              },
              {
                "const": "archived"
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "updatedAt": {
            "type": "string"
          },
          "archivedAt": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "id",
          "label",
          "description",
          "isBuiltIn",
          "status",
          "createdAt",
          "updatedAt"
        ],
        "additionalProperties": false
      },
      "D3": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "type": "array",
          "items": {
            "anyOf": [
              {
                "const": "receive-vehicle"
              },
              {
                "const": "advance-bookings"
              },
              {
                "const": "today-queue"
              },
              {
                "const": "customers"
              },
              {
                "const": "vehicles"
              },
              {
                "const": "search"
              },
              {
                "const": "my-queue"
              },
              {
                "const": "job-card"
              },
              {
                "const": "estimate"
              },
              {
                "const": "follow-ups"
              },
              {
                "const": "media"
              },
              {
                "const": "material-requests"
              },
              {
                "const": "issue-material"
              },
              {
                "const": "reconcile"
              },
              {
                "const": "stock"
              },
              {
                "const": "approvals"
              },
              {
                "const": "inward-purchases"
              },
              {
                "const": "my-tasks"
              },
              {
                "const": "work-update"
              },
              {
                "const": "qc-prep"
              },
              {
                "const": "ready-to-invoice"
              },
              {
                "const": "invoice"
              },
              {
                "const": "payment"
              },
              {
                "const": "delivery"
              },
              {
                "const": "dashboard"
              },
              {
                "const": "data-flow"
              },
              {
                "const": "jobs"
              },
              {
                "const": "manage"
              },
              {
                "const": "admin-console"
              },
              {
                "const": "sales-leads"
              },
              {
                "const": "quotations"
              },
              {
                "const": "quotation-settings"
              }
            ]
          }
        }
      },
      "D4": {
        "type": "object",
        "properties": {
          "profile": {
            "$ref": "#/$defs/D5"
          },
          "branch": {
            "$ref": "#/$defs/D6"
          },
          "jobs": {
            "$ref": "#/$defs/D7"
          },
          "pricing": {
            "$ref": "#/$defs/D8"
          },
          "billing": {
            "$ref": "#/$defs/D9"
          },
          "inventory": {
            "$ref": "#/$defs/D10"
          },
          "notifications": {
            "$ref": "#/$defs/D11"
          },
          "logRetention": {
            "$ref": "#/$defs/D12"
          }
        },
        "required": [
          "profile",
          "branch",
          "jobs",
          "pricing",
          "billing",
          "inventory",
          "notifications",
          "logRetention"
        ],
        "additionalProperties": false
      },
      "D5": {
        "type": "object",
        "properties": {
          "businessName": {
            "type": "string"
          },
          "legalName": {
            "type": "string"
          },
          "phone": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "address": {
            "type": "string"
          },
          "footer": {
            "type": "string"
          },
          "timezone": {
            "type": "string"
          },
          "currency": {
            "type": "string"
          }
        },
        "required": [
          "businessName",
          "legalName",
          "phone",
          "email",
          "address",
          "footer",
          "timezone",
          "currency"
        ],
        "additionalProperties": false
      },
      "D6": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "openingTime": {
            "type": "string"
          },
          "closingTime": {
            "type": "string"
          },
          "workingDays": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "holidayBehavior": {
            "anyOf": [
              {
                "const": "closed"
              },
              {
                "const": "appointment-only"
              }
            ]
          }
        },
        "required": [
          "name",
          "openingTime",
          "closingTime",
          "workingDays",
          "holidayBehavior"
        ],
        "additionalProperties": false
      },
      "D7": {
        "type": "object",
        "properties": {
          "jobNumberPrefix": {
            "type": "string"
          },
          "defaultPromisedHours": {
            "type": "number"
          },
          "requireQc": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "washingDefault": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "autoCloseAfterDelivery": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "jobNumberPrefix",
          "defaultPromisedHours",
          "requireQc",
          "washingDefault",
          "autoCloseAfterDelivery"
        ],
        "additionalProperties": false
      },
      "D8": {
        "type": "object",
        "properties": {
          "estimateValidityDays": {
            "type": "number"
          },
          "defaultLabourRate": {
            "type": "number"
          },
          "discountApprovalPercent": {
            "type": "number"
          },
          "requireEstimateApproval": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "estimateValidityDays",
          "defaultLabourRate",
          "discountApprovalPercent",
          "requireEstimateApproval"
        ],
        "additionalProperties": false
      },
      "D9": {
        "type": "object",
        "properties": {
          "gstin": {
            "type": "string"
          },
          "bankAccountHolder": {
            "type": "string"
          },
          "bankName": {
            "type": "string"
          },
          "bankAccountNumber": {
            "type": "string"
          },
          "bankIfsc": {
            "type": "string"
          },
          "bankBranch": {
            "type": "string"
          },
          "upiId": {
            "type": "string"
          },
          "defaultGstPercent": {
            "type": "number"
          },
          "invoicePrefix": {
            "type": "string"
          },
          "receiptPrefix": {
            "type": "string"
          },
          "gatePassPrefix": {
            "type": "string"
          },
          "paymentModes": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "required": [
          "gstin",
          "bankAccountHolder",
          "bankName",
          "bankAccountNumber",
          "bankIfsc",
          "bankBranch",
          "upiId",
          "defaultGstPercent",
          "invoicePrefix",
          "receiptPrefix",
          "gatePassPrefix",
          "paymentModes"
        ],
        "additionalProperties": false
      },
      "D10": {
        "type": "object",
        "properties": {
          "defaultUnit": {
            "type": "string"
          },
          "lowStockNotifications": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "requireAdjustmentReason": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "defaultUnit",
          "lowStockNotifications",
          "requireAdjustmentReason"
        ],
        "additionalProperties": false
      },
      "D11": {
        "type": "object",
        "properties": {
          "customerChannels": {
            "type": "array",
            "items": {
              "anyOf": [
                {
                  "const": "sms"
                },
                {
                  "const": "email"
                },
                {
                  "const": "whatsapp"
                }
              ]
            }
          },
          "documentHeader": {
            "type": "string"
          },
          "estimateTemplate": {
            "type": "string"
          },
          "invoiceTemplate": {
            "type": "string"
          },
          "jobCardCreatedWhatsAppTemplate": {
            "type": "string"
          },
          "jobCardCreatedEmailTemplate": {
            "type": "string"
          },
          "jobCardClosedWhatsAppTemplate": {
            "type": "string"
          },
          "jobCardClosedEmailTemplate": {
            "type": "string"
          }
        },
        "required": [
          "customerChannels",
          "documentHeader",
          "estimateTemplate",
          "invoiceTemplate",
          "jobCardCreatedWhatsAppTemplate",
          "jobCardCreatedEmailTemplate",
          "jobCardClosedWhatsAppTemplate",
          "jobCardClosedEmailTemplate"
        ],
        "additionalProperties": false
      },
      "D12": {
        "type": "object",
        "properties": {
          "operationalDays": {
            "type": "number"
          },
          "featureDays": {
            "type": "number"
          }
        },
        "required": [
          "operationalDays",
          "featureDays"
        ],
        "additionalProperties": false
      },
      "D13": {
        "type": "object",
        "properties": {
          "fontId": {
            "anyOf": [
              {
                "const": "system"
              },
              {
                "const": "arial"
              },
              {
                "const": "verdana"
              },
              {
                "const": "trebuchet"
              },
              {
                "const": "georgia"
              }
            ]
          },
          "paletteId": {
            "anyOf": [
              {
                "const": "go-lite"
              },
              {
                "const": "go-yellow"
              },
              {
                "const": "go-orange"
              },
              {
                "const": "go-blue"
              }
            ]
          }
        },
        "required": [
          "fontId",
          "paletteId"
        ],
        "additionalProperties": false
      },
      "D14": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "stream": {
            "anyOf": [
              {
                "const": "operational"
              },
              {
                "const": "feature"
              }
            ]
          },
          "timestamp": {
            "type": "string"
          },
          "level": {
            "anyOf": [
              {
                "const": "info"
              },
              {
                "const": "warning"
              },
              {
                "const": "error"
              }
            ]
          },
          "area": {
            "type": "string"
          },
          "feature": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "userId": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "userName": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "referenceId": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "details": {
            "anyOf": [
              {
                "$ref": "#/$defs/D15"
              }
            ]
          }
        },
        "required": [
          "id",
          "stream",
          "timestamp",
          "level",
          "area",
          "feature",
          "message"
        ],
        "additionalProperties": false
      },
      "D15": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "x-unverified": "unknown"
        }
      },
      "D16": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "fileName": {
            "type": "string"
          },
          "status": {
            "anyOf": [
              {
                "const": "mapping"
              },
              {
                "const": "validated"
              },
              {
                "const": "imported"
              },
              {
                "const": "failed"
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "importedAt": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "totalRows": {
            "type": "number"
          },
          "acceptedRows": {
            "type": "number"
          },
          "rejectedRows": {
            "type": "number"
          },
          "columnMapping": {
            "$ref": "#/$defs/D17"
          },
          "errors": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D18"
            }
          }
        },
        "required": [
          "id",
          "fileName",
          "status",
          "createdAt",
          "totalRows",
          "acceptedRows",
          "rejectedRows",
          "columnMapping",
          "errors"
        ],
        "additionalProperties": false
      },
      "D17": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "type": "string"
        }
      },
      "D18": {
        "type": "object",
        "properties": {
          "row": {
            "type": "number"
          },
          "field": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "message": {
            "type": "string"
          }
        },
        "required": [
          "row",
          "message"
        ],
        "additionalProperties": false
      },
      "D19": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "importBatchId": {
            "type": "string"
          },
          "sku": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "category": {
            "type": "string"
          },
          "unit": {
            "type": "string"
          },
          "stockQty": {
            "type": "number"
          },
          "lowStockQty": {
            "type": "number"
          },
          "sellingPrice": {
            "type": "number"
          },
          "importedAt": {
            "type": "string"
          }
        },
        "required": [
          "id",
          "importBatchId",
          "sku",
          "name",
          "category",
          "unit",
          "stockQty",
          "lowStockQty",
          "sellingPrice",
          "importedAt"
        ],
        "additionalProperties": false
      },
      "D20": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "category": {
            "anyOf": [
              {
                "const": "job-card"
              },
              {
                "const": "estimate"
              },
              {
                "const": "invoice"
              },
              {
                "const": "quotation"
              },
              {
                "const": "gate-pass"
              },
              {
                "const": "payment-receipt"
              }
            ]
          },
          "name": {
            "type": "string"
          },
          "html": {
            "type": "string"
          },
          "active": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "updatedAt": {
            "type": "string"
          },
          "seedVersion": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [
          "id",
          "category",
          "name",
          "html",
          "active",
          "createdAt",
          "updatedAt"
        ],
        "additionalProperties": false
      },
      "D21": {
        "type": "object",
        "properties": {
          "logo": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          },
          "stamp": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          },
          "authorizedSignature": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "logo",
          "stamp",
          "authorizedSignature"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": [
      "unknown"
    ]
  },
  {
    "operation": "OP-admin-demo-state-deleteReportTemplate",
    "route": "POST /api/v1/ui/commands/deleteReportTemplate",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "templateId": {
              "type": "string"
            }
          },
          "required": [
            "templateId"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "$ref": "#/$defs/D1"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "version": {
            "const": 2
          },
          "roles": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D2"
            }
          },
          "rolePageAccess": {
            "$ref": "#/$defs/D3"
          },
          "businessSettings": {
            "$ref": "#/$defs/D4"
          },
          "appTheme": {
            "$ref": "#/$defs/D13"
          },
          "logs": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D14"
            }
          },
          "importBatches": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D16"
            }
          },
          "sessionInventory": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D19"
            }
          },
          "reportTemplates": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D20"
            }
          },
          "companyAssets": {
            "$ref": "#/$defs/D21"
          }
        },
        "required": [
          "version",
          "roles",
          "rolePageAccess",
          "businessSettings",
          "appTheme",
          "logs",
          "importBatches",
          "sessionInventory",
          "reportTemplates",
          "companyAssets"
        ],
        "additionalProperties": false
      },
      "D2": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "label": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "systemRole": {
            "anyOf": [
              {
                "const": "admin"
              },
              {
                "const": "service"
              },
              {
                "const": "service_manager"
              },
              {
                "const": "reception"
              },
              {
                "const": "accounts"
              },
              {
                "const": "store"
              },
              {
                "const": "tech"
              }
            ]
          },
          "isBuiltIn": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "status": {
            "anyOf": [
              {
                "const": "active"
              },
              {
                "const": "archived"
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "updatedAt": {
            "type": "string"
          },
          "archivedAt": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "id",
          "label",
          "description",
          "isBuiltIn",
          "status",
          "createdAt",
          "updatedAt"
        ],
        "additionalProperties": false
      },
      "D3": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "type": "array",
          "items": {
            "anyOf": [
              {
                "const": "receive-vehicle"
              },
              {
                "const": "advance-bookings"
              },
              {
                "const": "today-queue"
              },
              {
                "const": "customers"
              },
              {
                "const": "vehicles"
              },
              {
                "const": "search"
              },
              {
                "const": "my-queue"
              },
              {
                "const": "job-card"
              },
              {
                "const": "estimate"
              },
              {
                "const": "follow-ups"
              },
              {
                "const": "media"
              },
              {
                "const": "material-requests"
              },
              {
                "const": "issue-material"
              },
              {
                "const": "reconcile"
              },
              {
                "const": "stock"
              },
              {
                "const": "approvals"
              },
              {
                "const": "inward-purchases"
              },
              {
                "const": "my-tasks"
              },
              {
                "const": "work-update"
              },
              {
                "const": "qc-prep"
              },
              {
                "const": "ready-to-invoice"
              },
              {
                "const": "invoice"
              },
              {
                "const": "payment"
              },
              {
                "const": "delivery"
              },
              {
                "const": "dashboard"
              },
              {
                "const": "data-flow"
              },
              {
                "const": "jobs"
              },
              {
                "const": "manage"
              },
              {
                "const": "admin-console"
              },
              {
                "const": "sales-leads"
              },
              {
                "const": "quotations"
              },
              {
                "const": "quotation-settings"
              }
            ]
          }
        }
      },
      "D4": {
        "type": "object",
        "properties": {
          "profile": {
            "$ref": "#/$defs/D5"
          },
          "branch": {
            "$ref": "#/$defs/D6"
          },
          "jobs": {
            "$ref": "#/$defs/D7"
          },
          "pricing": {
            "$ref": "#/$defs/D8"
          },
          "billing": {
            "$ref": "#/$defs/D9"
          },
          "inventory": {
            "$ref": "#/$defs/D10"
          },
          "notifications": {
            "$ref": "#/$defs/D11"
          },
          "logRetention": {
            "$ref": "#/$defs/D12"
          }
        },
        "required": [
          "profile",
          "branch",
          "jobs",
          "pricing",
          "billing",
          "inventory",
          "notifications",
          "logRetention"
        ],
        "additionalProperties": false
      },
      "D5": {
        "type": "object",
        "properties": {
          "businessName": {
            "type": "string"
          },
          "legalName": {
            "type": "string"
          },
          "phone": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "address": {
            "type": "string"
          },
          "footer": {
            "type": "string"
          },
          "timezone": {
            "type": "string"
          },
          "currency": {
            "type": "string"
          }
        },
        "required": [
          "businessName",
          "legalName",
          "phone",
          "email",
          "address",
          "footer",
          "timezone",
          "currency"
        ],
        "additionalProperties": false
      },
      "D6": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "openingTime": {
            "type": "string"
          },
          "closingTime": {
            "type": "string"
          },
          "workingDays": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "holidayBehavior": {
            "anyOf": [
              {
                "const": "closed"
              },
              {
                "const": "appointment-only"
              }
            ]
          }
        },
        "required": [
          "name",
          "openingTime",
          "closingTime",
          "workingDays",
          "holidayBehavior"
        ],
        "additionalProperties": false
      },
      "D7": {
        "type": "object",
        "properties": {
          "jobNumberPrefix": {
            "type": "string"
          },
          "defaultPromisedHours": {
            "type": "number"
          },
          "requireQc": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "washingDefault": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "autoCloseAfterDelivery": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "jobNumberPrefix",
          "defaultPromisedHours",
          "requireQc",
          "washingDefault",
          "autoCloseAfterDelivery"
        ],
        "additionalProperties": false
      },
      "D8": {
        "type": "object",
        "properties": {
          "estimateValidityDays": {
            "type": "number"
          },
          "defaultLabourRate": {
            "type": "number"
          },
          "discountApprovalPercent": {
            "type": "number"
          },
          "requireEstimateApproval": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "estimateValidityDays",
          "defaultLabourRate",
          "discountApprovalPercent",
          "requireEstimateApproval"
        ],
        "additionalProperties": false
      },
      "D9": {
        "type": "object",
        "properties": {
          "gstin": {
            "type": "string"
          },
          "bankAccountHolder": {
            "type": "string"
          },
          "bankName": {
            "type": "string"
          },
          "bankAccountNumber": {
            "type": "string"
          },
          "bankIfsc": {
            "type": "string"
          },
          "bankBranch": {
            "type": "string"
          },
          "upiId": {
            "type": "string"
          },
          "defaultGstPercent": {
            "type": "number"
          },
          "invoicePrefix": {
            "type": "string"
          },
          "receiptPrefix": {
            "type": "string"
          },
          "gatePassPrefix": {
            "type": "string"
          },
          "paymentModes": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "required": [
          "gstin",
          "bankAccountHolder",
          "bankName",
          "bankAccountNumber",
          "bankIfsc",
          "bankBranch",
          "upiId",
          "defaultGstPercent",
          "invoicePrefix",
          "receiptPrefix",
          "gatePassPrefix",
          "paymentModes"
        ],
        "additionalProperties": false
      },
      "D10": {
        "type": "object",
        "properties": {
          "defaultUnit": {
            "type": "string"
          },
          "lowStockNotifications": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "requireAdjustmentReason": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "defaultUnit",
          "lowStockNotifications",
          "requireAdjustmentReason"
        ],
        "additionalProperties": false
      },
      "D11": {
        "type": "object",
        "properties": {
          "customerChannels": {
            "type": "array",
            "items": {
              "anyOf": [
                {
                  "const": "sms"
                },
                {
                  "const": "email"
                },
                {
                  "const": "whatsapp"
                }
              ]
            }
          },
          "documentHeader": {
            "type": "string"
          },
          "estimateTemplate": {
            "type": "string"
          },
          "invoiceTemplate": {
            "type": "string"
          },
          "jobCardCreatedWhatsAppTemplate": {
            "type": "string"
          },
          "jobCardCreatedEmailTemplate": {
            "type": "string"
          },
          "jobCardClosedWhatsAppTemplate": {
            "type": "string"
          },
          "jobCardClosedEmailTemplate": {
            "type": "string"
          }
        },
        "required": [
          "customerChannels",
          "documentHeader",
          "estimateTemplate",
          "invoiceTemplate",
          "jobCardCreatedWhatsAppTemplate",
          "jobCardCreatedEmailTemplate",
          "jobCardClosedWhatsAppTemplate",
          "jobCardClosedEmailTemplate"
        ],
        "additionalProperties": false
      },
      "D12": {
        "type": "object",
        "properties": {
          "operationalDays": {
            "type": "number"
          },
          "featureDays": {
            "type": "number"
          }
        },
        "required": [
          "operationalDays",
          "featureDays"
        ],
        "additionalProperties": false
      },
      "D13": {
        "type": "object",
        "properties": {
          "fontId": {
            "anyOf": [
              {
                "const": "system"
              },
              {
                "const": "arial"
              },
              {
                "const": "verdana"
              },
              {
                "const": "trebuchet"
              },
              {
                "const": "georgia"
              }
            ]
          },
          "paletteId": {
            "anyOf": [
              {
                "const": "go-lite"
              },
              {
                "const": "go-yellow"
              },
              {
                "const": "go-orange"
              },
              {
                "const": "go-blue"
              }
            ]
          }
        },
        "required": [
          "fontId",
          "paletteId"
        ],
        "additionalProperties": false
      },
      "D14": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "stream": {
            "anyOf": [
              {
                "const": "operational"
              },
              {
                "const": "feature"
              }
            ]
          },
          "timestamp": {
            "type": "string"
          },
          "level": {
            "anyOf": [
              {
                "const": "info"
              },
              {
                "const": "warning"
              },
              {
                "const": "error"
              }
            ]
          },
          "area": {
            "type": "string"
          },
          "feature": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "userId": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "userName": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "referenceId": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "details": {
            "anyOf": [
              {
                "$ref": "#/$defs/D15"
              }
            ]
          }
        },
        "required": [
          "id",
          "stream",
          "timestamp",
          "level",
          "area",
          "feature",
          "message"
        ],
        "additionalProperties": false
      },
      "D15": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "x-unverified": "unknown"
        }
      },
      "D16": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "fileName": {
            "type": "string"
          },
          "status": {
            "anyOf": [
              {
                "const": "mapping"
              },
              {
                "const": "validated"
              },
              {
                "const": "imported"
              },
              {
                "const": "failed"
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "importedAt": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "totalRows": {
            "type": "number"
          },
          "acceptedRows": {
            "type": "number"
          },
          "rejectedRows": {
            "type": "number"
          },
          "columnMapping": {
            "$ref": "#/$defs/D17"
          },
          "errors": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D18"
            }
          }
        },
        "required": [
          "id",
          "fileName",
          "status",
          "createdAt",
          "totalRows",
          "acceptedRows",
          "rejectedRows",
          "columnMapping",
          "errors"
        ],
        "additionalProperties": false
      },
      "D17": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "type": "string"
        }
      },
      "D18": {
        "type": "object",
        "properties": {
          "row": {
            "type": "number"
          },
          "field": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "message": {
            "type": "string"
          }
        },
        "required": [
          "row",
          "message"
        ],
        "additionalProperties": false
      },
      "D19": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "importBatchId": {
            "type": "string"
          },
          "sku": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "category": {
            "type": "string"
          },
          "unit": {
            "type": "string"
          },
          "stockQty": {
            "type": "number"
          },
          "lowStockQty": {
            "type": "number"
          },
          "sellingPrice": {
            "type": "number"
          },
          "importedAt": {
            "type": "string"
          }
        },
        "required": [
          "id",
          "importBatchId",
          "sku",
          "name",
          "category",
          "unit",
          "stockQty",
          "lowStockQty",
          "sellingPrice",
          "importedAt"
        ],
        "additionalProperties": false
      },
      "D20": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "category": {
            "anyOf": [
              {
                "const": "job-card"
              },
              {
                "const": "estimate"
              },
              {
                "const": "invoice"
              },
              {
                "const": "quotation"
              },
              {
                "const": "gate-pass"
              },
              {
                "const": "payment-receipt"
              }
            ]
          },
          "name": {
            "type": "string"
          },
          "html": {
            "type": "string"
          },
          "active": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "updatedAt": {
            "type": "string"
          },
          "seedVersion": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [
          "id",
          "category",
          "name",
          "html",
          "active",
          "createdAt",
          "updatedAt"
        ],
        "additionalProperties": false
      },
      "D21": {
        "type": "object",
        "properties": {
          "logo": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          },
          "stamp": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          },
          "authorizedSignature": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "logo",
          "stamp",
          "authorizedSignature"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": [
      "unknown"
    ]
  },
  {
    "operation": "OP-admin-demo-state-saveCompanyIdentity",
    "route": "POST /api/v1/ui/commands/saveCompanyIdentity",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "companyName": {
              "type": "string"
            },
            "assets": {
              "$ref": "#/$defs/D1"
            },
            "details": {
              "anyOf": [
                {
                  "$ref": "#/$defs/D2"
                }
              ]
            }
          },
          "required": [
            "companyName",
            "assets"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "$ref": "#/$defs/D3"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "logo": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          },
          "stamp": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          },
          "authorizedSignature": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "logo",
          "stamp",
          "authorizedSignature"
        ],
        "additionalProperties": false
      },
      "D2": {
        "type": "object",
        "properties": {
          "address": {
            "type": "string"
          },
          "phone": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "gstin": {
            "type": "string"
          },
          "footer": {
            "type": "string"
          }
        },
        "required": [
          "address",
          "phone",
          "email",
          "gstin",
          "footer"
        ],
        "additionalProperties": false
      },
      "D3": {
        "type": "object",
        "properties": {
          "version": {
            "const": 2
          },
          "roles": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D4"
            }
          },
          "rolePageAccess": {
            "$ref": "#/$defs/D5"
          },
          "businessSettings": {
            "$ref": "#/$defs/D6"
          },
          "appTheme": {
            "$ref": "#/$defs/D15"
          },
          "logs": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D16"
            }
          },
          "importBatches": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D18"
            }
          },
          "sessionInventory": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D21"
            }
          },
          "reportTemplates": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D22"
            }
          },
          "companyAssets": {
            "$ref": "#/$defs/D1"
          }
        },
        "required": [
          "version",
          "roles",
          "rolePageAccess",
          "businessSettings",
          "appTheme",
          "logs",
          "importBatches",
          "sessionInventory",
          "reportTemplates",
          "companyAssets"
        ],
        "additionalProperties": false
      },
      "D4": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "label": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "systemRole": {
            "anyOf": [
              {
                "const": "admin"
              },
              {
                "const": "service"
              },
              {
                "const": "service_manager"
              },
              {
                "const": "reception"
              },
              {
                "const": "accounts"
              },
              {
                "const": "store"
              },
              {
                "const": "tech"
              }
            ]
          },
          "isBuiltIn": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "status": {
            "anyOf": [
              {
                "const": "active"
              },
              {
                "const": "archived"
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "updatedAt": {
            "type": "string"
          },
          "archivedAt": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "id",
          "label",
          "description",
          "isBuiltIn",
          "status",
          "createdAt",
          "updatedAt"
        ],
        "additionalProperties": false
      },
      "D5": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "type": "array",
          "items": {
            "anyOf": [
              {
                "const": "receive-vehicle"
              },
              {
                "const": "advance-bookings"
              },
              {
                "const": "today-queue"
              },
              {
                "const": "customers"
              },
              {
                "const": "vehicles"
              },
              {
                "const": "search"
              },
              {
                "const": "my-queue"
              },
              {
                "const": "job-card"
              },
              {
                "const": "estimate"
              },
              {
                "const": "follow-ups"
              },
              {
                "const": "media"
              },
              {
                "const": "material-requests"
              },
              {
                "const": "issue-material"
              },
              {
                "const": "reconcile"
              },
              {
                "const": "stock"
              },
              {
                "const": "approvals"
              },
              {
                "const": "inward-purchases"
              },
              {
                "const": "my-tasks"
              },
              {
                "const": "work-update"
              },
              {
                "const": "qc-prep"
              },
              {
                "const": "ready-to-invoice"
              },
              {
                "const": "invoice"
              },
              {
                "const": "payment"
              },
              {
                "const": "delivery"
              },
              {
                "const": "dashboard"
              },
              {
                "const": "data-flow"
              },
              {
                "const": "jobs"
              },
              {
                "const": "manage"
              },
              {
                "const": "admin-console"
              },
              {
                "const": "sales-leads"
              },
              {
                "const": "quotations"
              },
              {
                "const": "quotation-settings"
              }
            ]
          }
        }
      },
      "D6": {
        "type": "object",
        "properties": {
          "profile": {
            "$ref": "#/$defs/D7"
          },
          "branch": {
            "$ref": "#/$defs/D8"
          },
          "jobs": {
            "$ref": "#/$defs/D9"
          },
          "pricing": {
            "$ref": "#/$defs/D10"
          },
          "billing": {
            "$ref": "#/$defs/D11"
          },
          "inventory": {
            "$ref": "#/$defs/D12"
          },
          "notifications": {
            "$ref": "#/$defs/D13"
          },
          "logRetention": {
            "$ref": "#/$defs/D14"
          }
        },
        "required": [
          "profile",
          "branch",
          "jobs",
          "pricing",
          "billing",
          "inventory",
          "notifications",
          "logRetention"
        ],
        "additionalProperties": false
      },
      "D7": {
        "type": "object",
        "properties": {
          "businessName": {
            "type": "string"
          },
          "legalName": {
            "type": "string"
          },
          "phone": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "address": {
            "type": "string"
          },
          "footer": {
            "type": "string"
          },
          "timezone": {
            "type": "string"
          },
          "currency": {
            "type": "string"
          }
        },
        "required": [
          "businessName",
          "legalName",
          "phone",
          "email",
          "address",
          "footer",
          "timezone",
          "currency"
        ],
        "additionalProperties": false
      },
      "D8": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "openingTime": {
            "type": "string"
          },
          "closingTime": {
            "type": "string"
          },
          "workingDays": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "holidayBehavior": {
            "anyOf": [
              {
                "const": "closed"
              },
              {
                "const": "appointment-only"
              }
            ]
          }
        },
        "required": [
          "name",
          "openingTime",
          "closingTime",
          "workingDays",
          "holidayBehavior"
        ],
        "additionalProperties": false
      },
      "D9": {
        "type": "object",
        "properties": {
          "jobNumberPrefix": {
            "type": "string"
          },
          "defaultPromisedHours": {
            "type": "number"
          },
          "requireQc": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "washingDefault": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "autoCloseAfterDelivery": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "jobNumberPrefix",
          "defaultPromisedHours",
          "requireQc",
          "washingDefault",
          "autoCloseAfterDelivery"
        ],
        "additionalProperties": false
      },
      "D10": {
        "type": "object",
        "properties": {
          "estimateValidityDays": {
            "type": "number"
          },
          "defaultLabourRate": {
            "type": "number"
          },
          "discountApprovalPercent": {
            "type": "number"
          },
          "requireEstimateApproval": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "estimateValidityDays",
          "defaultLabourRate",
          "discountApprovalPercent",
          "requireEstimateApproval"
        ],
        "additionalProperties": false
      },
      "D11": {
        "type": "object",
        "properties": {
          "gstin": {
            "type": "string"
          },
          "bankAccountHolder": {
            "type": "string"
          },
          "bankName": {
            "type": "string"
          },
          "bankAccountNumber": {
            "type": "string"
          },
          "bankIfsc": {
            "type": "string"
          },
          "bankBranch": {
            "type": "string"
          },
          "upiId": {
            "type": "string"
          },
          "defaultGstPercent": {
            "type": "number"
          },
          "invoicePrefix": {
            "type": "string"
          },
          "receiptPrefix": {
            "type": "string"
          },
          "gatePassPrefix": {
            "type": "string"
          },
          "paymentModes": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "required": [
          "gstin",
          "bankAccountHolder",
          "bankName",
          "bankAccountNumber",
          "bankIfsc",
          "bankBranch",
          "upiId",
          "defaultGstPercent",
          "invoicePrefix",
          "receiptPrefix",
          "gatePassPrefix",
          "paymentModes"
        ],
        "additionalProperties": false
      },
      "D12": {
        "type": "object",
        "properties": {
          "defaultUnit": {
            "type": "string"
          },
          "lowStockNotifications": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "requireAdjustmentReason": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "defaultUnit",
          "lowStockNotifications",
          "requireAdjustmentReason"
        ],
        "additionalProperties": false
      },
      "D13": {
        "type": "object",
        "properties": {
          "customerChannels": {
            "type": "array",
            "items": {
              "anyOf": [
                {
                  "const": "sms"
                },
                {
                  "const": "email"
                },
                {
                  "const": "whatsapp"
                }
              ]
            }
          },
          "documentHeader": {
            "type": "string"
          },
          "estimateTemplate": {
            "type": "string"
          },
          "invoiceTemplate": {
            "type": "string"
          },
          "jobCardCreatedWhatsAppTemplate": {
            "type": "string"
          },
          "jobCardCreatedEmailTemplate": {
            "type": "string"
          },
          "jobCardClosedWhatsAppTemplate": {
            "type": "string"
          },
          "jobCardClosedEmailTemplate": {
            "type": "string"
          }
        },
        "required": [
          "customerChannels",
          "documentHeader",
          "estimateTemplate",
          "invoiceTemplate",
          "jobCardCreatedWhatsAppTemplate",
          "jobCardCreatedEmailTemplate",
          "jobCardClosedWhatsAppTemplate",
          "jobCardClosedEmailTemplate"
        ],
        "additionalProperties": false
      },
      "D14": {
        "type": "object",
        "properties": {
          "operationalDays": {
            "type": "number"
          },
          "featureDays": {
            "type": "number"
          }
        },
        "required": [
          "operationalDays",
          "featureDays"
        ],
        "additionalProperties": false
      },
      "D15": {
        "type": "object",
        "properties": {
          "fontId": {
            "anyOf": [
              {
                "const": "system"
              },
              {
                "const": "arial"
              },
              {
                "const": "verdana"
              },
              {
                "const": "trebuchet"
              },
              {
                "const": "georgia"
              }
            ]
          },
          "paletteId": {
            "anyOf": [
              {
                "const": "go-lite"
              },
              {
                "const": "go-yellow"
              },
              {
                "const": "go-orange"
              },
              {
                "const": "go-blue"
              }
            ]
          }
        },
        "required": [
          "fontId",
          "paletteId"
        ],
        "additionalProperties": false
      },
      "D16": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "stream": {
            "anyOf": [
              {
                "const": "operational"
              },
              {
                "const": "feature"
              }
            ]
          },
          "timestamp": {
            "type": "string"
          },
          "level": {
            "anyOf": [
              {
                "const": "info"
              },
              {
                "const": "warning"
              },
              {
                "const": "error"
              }
            ]
          },
          "area": {
            "type": "string"
          },
          "feature": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "userId": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "userName": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "referenceId": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "details": {
            "anyOf": [
              {
                "$ref": "#/$defs/D17"
              }
            ]
          }
        },
        "required": [
          "id",
          "stream",
          "timestamp",
          "level",
          "area",
          "feature",
          "message"
        ],
        "additionalProperties": false
      },
      "D17": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "x-unverified": "unknown"
        }
      },
      "D18": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "fileName": {
            "type": "string"
          },
          "status": {
            "anyOf": [
              {
                "const": "mapping"
              },
              {
                "const": "validated"
              },
              {
                "const": "imported"
              },
              {
                "const": "failed"
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "importedAt": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "totalRows": {
            "type": "number"
          },
          "acceptedRows": {
            "type": "number"
          },
          "rejectedRows": {
            "type": "number"
          },
          "columnMapping": {
            "$ref": "#/$defs/D19"
          },
          "errors": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D20"
            }
          }
        },
        "required": [
          "id",
          "fileName",
          "status",
          "createdAt",
          "totalRows",
          "acceptedRows",
          "rejectedRows",
          "columnMapping",
          "errors"
        ],
        "additionalProperties": false
      },
      "D19": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "type": "string"
        }
      },
      "D20": {
        "type": "object",
        "properties": {
          "row": {
            "type": "number"
          },
          "field": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "message": {
            "type": "string"
          }
        },
        "required": [
          "row",
          "message"
        ],
        "additionalProperties": false
      },
      "D21": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "importBatchId": {
            "type": "string"
          },
          "sku": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "category": {
            "type": "string"
          },
          "unit": {
            "type": "string"
          },
          "stockQty": {
            "type": "number"
          },
          "lowStockQty": {
            "type": "number"
          },
          "sellingPrice": {
            "type": "number"
          },
          "importedAt": {
            "type": "string"
          }
        },
        "required": [
          "id",
          "importBatchId",
          "sku",
          "name",
          "category",
          "unit",
          "stockQty",
          "lowStockQty",
          "sellingPrice",
          "importedAt"
        ],
        "additionalProperties": false
      },
      "D22": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "category": {
            "anyOf": [
              {
                "const": "job-card"
              },
              {
                "const": "estimate"
              },
              {
                "const": "invoice"
              },
              {
                "const": "quotation"
              },
              {
                "const": "gate-pass"
              },
              {
                "const": "payment-receipt"
              }
            ]
          },
          "name": {
            "type": "string"
          },
          "html": {
            "type": "string"
          },
          "active": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "updatedAt": {
            "type": "string"
          },
          "seedVersion": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [
          "id",
          "category",
          "name",
          "html",
          "active",
          "createdAt",
          "updatedAt"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": [
      "unknown"
    ]
  },
  {
    "operation": "OP-admin-demo-state-clearDemoLogs",
    "route": "POST /api/v1/ui/commands/clearDemoLogs",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "stream": {
              "anyOf": [
                {
                  "const": "operational"
                },
                {
                  "const": "feature"
                },
                {
                  "const": "all"
                }
              ]
            }
          },
          "required": [],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "$ref": "#/$defs/D1"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "version": {
            "const": 2
          },
          "roles": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D2"
            }
          },
          "rolePageAccess": {
            "$ref": "#/$defs/D3"
          },
          "businessSettings": {
            "$ref": "#/$defs/D4"
          },
          "appTheme": {
            "$ref": "#/$defs/D13"
          },
          "logs": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D14"
            }
          },
          "importBatches": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D16"
            }
          },
          "sessionInventory": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D19"
            }
          },
          "reportTemplates": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D20"
            }
          },
          "companyAssets": {
            "$ref": "#/$defs/D21"
          }
        },
        "required": [
          "version",
          "roles",
          "rolePageAccess",
          "businessSettings",
          "appTheme",
          "logs",
          "importBatches",
          "sessionInventory",
          "reportTemplates",
          "companyAssets"
        ],
        "additionalProperties": false
      },
      "D2": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "label": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "systemRole": {
            "anyOf": [
              {
                "const": "admin"
              },
              {
                "const": "service"
              },
              {
                "const": "service_manager"
              },
              {
                "const": "reception"
              },
              {
                "const": "accounts"
              },
              {
                "const": "store"
              },
              {
                "const": "tech"
              }
            ]
          },
          "isBuiltIn": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "status": {
            "anyOf": [
              {
                "const": "active"
              },
              {
                "const": "archived"
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "updatedAt": {
            "type": "string"
          },
          "archivedAt": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "id",
          "label",
          "description",
          "isBuiltIn",
          "status",
          "createdAt",
          "updatedAt"
        ],
        "additionalProperties": false
      },
      "D3": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "type": "array",
          "items": {
            "anyOf": [
              {
                "const": "receive-vehicle"
              },
              {
                "const": "advance-bookings"
              },
              {
                "const": "today-queue"
              },
              {
                "const": "customers"
              },
              {
                "const": "vehicles"
              },
              {
                "const": "search"
              },
              {
                "const": "my-queue"
              },
              {
                "const": "job-card"
              },
              {
                "const": "estimate"
              },
              {
                "const": "follow-ups"
              },
              {
                "const": "media"
              },
              {
                "const": "material-requests"
              },
              {
                "const": "issue-material"
              },
              {
                "const": "reconcile"
              },
              {
                "const": "stock"
              },
              {
                "const": "approvals"
              },
              {
                "const": "inward-purchases"
              },
              {
                "const": "my-tasks"
              },
              {
                "const": "work-update"
              },
              {
                "const": "qc-prep"
              },
              {
                "const": "ready-to-invoice"
              },
              {
                "const": "invoice"
              },
              {
                "const": "payment"
              },
              {
                "const": "delivery"
              },
              {
                "const": "dashboard"
              },
              {
                "const": "data-flow"
              },
              {
                "const": "jobs"
              },
              {
                "const": "manage"
              },
              {
                "const": "admin-console"
              },
              {
                "const": "sales-leads"
              },
              {
                "const": "quotations"
              },
              {
                "const": "quotation-settings"
              }
            ]
          }
        }
      },
      "D4": {
        "type": "object",
        "properties": {
          "profile": {
            "$ref": "#/$defs/D5"
          },
          "branch": {
            "$ref": "#/$defs/D6"
          },
          "jobs": {
            "$ref": "#/$defs/D7"
          },
          "pricing": {
            "$ref": "#/$defs/D8"
          },
          "billing": {
            "$ref": "#/$defs/D9"
          },
          "inventory": {
            "$ref": "#/$defs/D10"
          },
          "notifications": {
            "$ref": "#/$defs/D11"
          },
          "logRetention": {
            "$ref": "#/$defs/D12"
          }
        },
        "required": [
          "profile",
          "branch",
          "jobs",
          "pricing",
          "billing",
          "inventory",
          "notifications",
          "logRetention"
        ],
        "additionalProperties": false
      },
      "D5": {
        "type": "object",
        "properties": {
          "businessName": {
            "type": "string"
          },
          "legalName": {
            "type": "string"
          },
          "phone": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "address": {
            "type": "string"
          },
          "footer": {
            "type": "string"
          },
          "timezone": {
            "type": "string"
          },
          "currency": {
            "type": "string"
          }
        },
        "required": [
          "businessName",
          "legalName",
          "phone",
          "email",
          "address",
          "footer",
          "timezone",
          "currency"
        ],
        "additionalProperties": false
      },
      "D6": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "openingTime": {
            "type": "string"
          },
          "closingTime": {
            "type": "string"
          },
          "workingDays": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "holidayBehavior": {
            "anyOf": [
              {
                "const": "closed"
              },
              {
                "const": "appointment-only"
              }
            ]
          }
        },
        "required": [
          "name",
          "openingTime",
          "closingTime",
          "workingDays",
          "holidayBehavior"
        ],
        "additionalProperties": false
      },
      "D7": {
        "type": "object",
        "properties": {
          "jobNumberPrefix": {
            "type": "string"
          },
          "defaultPromisedHours": {
            "type": "number"
          },
          "requireQc": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "washingDefault": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "autoCloseAfterDelivery": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "jobNumberPrefix",
          "defaultPromisedHours",
          "requireQc",
          "washingDefault",
          "autoCloseAfterDelivery"
        ],
        "additionalProperties": false
      },
      "D8": {
        "type": "object",
        "properties": {
          "estimateValidityDays": {
            "type": "number"
          },
          "defaultLabourRate": {
            "type": "number"
          },
          "discountApprovalPercent": {
            "type": "number"
          },
          "requireEstimateApproval": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "estimateValidityDays",
          "defaultLabourRate",
          "discountApprovalPercent",
          "requireEstimateApproval"
        ],
        "additionalProperties": false
      },
      "D9": {
        "type": "object",
        "properties": {
          "gstin": {
            "type": "string"
          },
          "bankAccountHolder": {
            "type": "string"
          },
          "bankName": {
            "type": "string"
          },
          "bankAccountNumber": {
            "type": "string"
          },
          "bankIfsc": {
            "type": "string"
          },
          "bankBranch": {
            "type": "string"
          },
          "upiId": {
            "type": "string"
          },
          "defaultGstPercent": {
            "type": "number"
          },
          "invoicePrefix": {
            "type": "string"
          },
          "receiptPrefix": {
            "type": "string"
          },
          "gatePassPrefix": {
            "type": "string"
          },
          "paymentModes": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "required": [
          "gstin",
          "bankAccountHolder",
          "bankName",
          "bankAccountNumber",
          "bankIfsc",
          "bankBranch",
          "upiId",
          "defaultGstPercent",
          "invoicePrefix",
          "receiptPrefix",
          "gatePassPrefix",
          "paymentModes"
        ],
        "additionalProperties": false
      },
      "D10": {
        "type": "object",
        "properties": {
          "defaultUnit": {
            "type": "string"
          },
          "lowStockNotifications": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "requireAdjustmentReason": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "defaultUnit",
          "lowStockNotifications",
          "requireAdjustmentReason"
        ],
        "additionalProperties": false
      },
      "D11": {
        "type": "object",
        "properties": {
          "customerChannels": {
            "type": "array",
            "items": {
              "anyOf": [
                {
                  "const": "sms"
                },
                {
                  "const": "email"
                },
                {
                  "const": "whatsapp"
                }
              ]
            }
          },
          "documentHeader": {
            "type": "string"
          },
          "estimateTemplate": {
            "type": "string"
          },
          "invoiceTemplate": {
            "type": "string"
          },
          "jobCardCreatedWhatsAppTemplate": {
            "type": "string"
          },
          "jobCardCreatedEmailTemplate": {
            "type": "string"
          },
          "jobCardClosedWhatsAppTemplate": {
            "type": "string"
          },
          "jobCardClosedEmailTemplate": {
            "type": "string"
          }
        },
        "required": [
          "customerChannels",
          "documentHeader",
          "estimateTemplate",
          "invoiceTemplate",
          "jobCardCreatedWhatsAppTemplate",
          "jobCardCreatedEmailTemplate",
          "jobCardClosedWhatsAppTemplate",
          "jobCardClosedEmailTemplate"
        ],
        "additionalProperties": false
      },
      "D12": {
        "type": "object",
        "properties": {
          "operationalDays": {
            "type": "number"
          },
          "featureDays": {
            "type": "number"
          }
        },
        "required": [
          "operationalDays",
          "featureDays"
        ],
        "additionalProperties": false
      },
      "D13": {
        "type": "object",
        "properties": {
          "fontId": {
            "anyOf": [
              {
                "const": "system"
              },
              {
                "const": "arial"
              },
              {
                "const": "verdana"
              },
              {
                "const": "trebuchet"
              },
              {
                "const": "georgia"
              }
            ]
          },
          "paletteId": {
            "anyOf": [
              {
                "const": "go-lite"
              },
              {
                "const": "go-yellow"
              },
              {
                "const": "go-orange"
              },
              {
                "const": "go-blue"
              }
            ]
          }
        },
        "required": [
          "fontId",
          "paletteId"
        ],
        "additionalProperties": false
      },
      "D14": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "stream": {
            "anyOf": [
              {
                "const": "operational"
              },
              {
                "const": "feature"
              }
            ]
          },
          "timestamp": {
            "type": "string"
          },
          "level": {
            "anyOf": [
              {
                "const": "info"
              },
              {
                "const": "warning"
              },
              {
                "const": "error"
              }
            ]
          },
          "area": {
            "type": "string"
          },
          "feature": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "userId": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "userName": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "referenceId": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "details": {
            "anyOf": [
              {
                "$ref": "#/$defs/D15"
              }
            ]
          }
        },
        "required": [
          "id",
          "stream",
          "timestamp",
          "level",
          "area",
          "feature",
          "message"
        ],
        "additionalProperties": false
      },
      "D15": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "x-unverified": "unknown"
        }
      },
      "D16": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "fileName": {
            "type": "string"
          },
          "status": {
            "anyOf": [
              {
                "const": "mapping"
              },
              {
                "const": "validated"
              },
              {
                "const": "imported"
              },
              {
                "const": "failed"
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "importedAt": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "totalRows": {
            "type": "number"
          },
          "acceptedRows": {
            "type": "number"
          },
          "rejectedRows": {
            "type": "number"
          },
          "columnMapping": {
            "$ref": "#/$defs/D17"
          },
          "errors": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D18"
            }
          }
        },
        "required": [
          "id",
          "fileName",
          "status",
          "createdAt",
          "totalRows",
          "acceptedRows",
          "rejectedRows",
          "columnMapping",
          "errors"
        ],
        "additionalProperties": false
      },
      "D17": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "type": "string"
        }
      },
      "D18": {
        "type": "object",
        "properties": {
          "row": {
            "type": "number"
          },
          "field": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "message": {
            "type": "string"
          }
        },
        "required": [
          "row",
          "message"
        ],
        "additionalProperties": false
      },
      "D19": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "importBatchId": {
            "type": "string"
          },
          "sku": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "category": {
            "type": "string"
          },
          "unit": {
            "type": "string"
          },
          "stockQty": {
            "type": "number"
          },
          "lowStockQty": {
            "type": "number"
          },
          "sellingPrice": {
            "type": "number"
          },
          "importedAt": {
            "type": "string"
          }
        },
        "required": [
          "id",
          "importBatchId",
          "sku",
          "name",
          "category",
          "unit",
          "stockQty",
          "lowStockQty",
          "sellingPrice",
          "importedAt"
        ],
        "additionalProperties": false
      },
      "D20": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "category": {
            "anyOf": [
              {
                "const": "job-card"
              },
              {
                "const": "estimate"
              },
              {
                "const": "invoice"
              },
              {
                "const": "quotation"
              },
              {
                "const": "gate-pass"
              },
              {
                "const": "payment-receipt"
              }
            ]
          },
          "name": {
            "type": "string"
          },
          "html": {
            "type": "string"
          },
          "active": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "updatedAt": {
            "type": "string"
          },
          "seedVersion": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [
          "id",
          "category",
          "name",
          "html",
          "active",
          "createdAt",
          "updatedAt"
        ],
        "additionalProperties": false
      },
      "D21": {
        "type": "object",
        "properties": {
          "logo": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          },
          "stamp": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          },
          "authorizedSignature": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "logo",
          "stamp",
          "authorizedSignature"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": [
      "unknown"
    ]
  },
  {
    "operation": "OP-admin-demo-state-confirmInventoryImport",
    "route": "POST /api/v1/ui/commands/confirmInventoryImport",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "$ref": "#/$defs/D4"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "fileName": {
            "type": "string"
          },
          "columnMapping": {
            "$ref": "#/$defs/D2"
          },
          "totalRows": {
            "type": "number"
          },
          "validRows": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D3"
            }
          },
          "rejectedRows": {
            "type": "number"
          }
        },
        "required": [
          "fileName",
          "columnMapping",
          "totalRows",
          "validRows",
          "rejectedRows"
        ],
        "additionalProperties": false
      },
      "D2": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "type": "string"
        }
      },
      "D3": {
        "type": "object",
        "properties": {
          "sku": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "category": {
            "type": "string"
          },
          "unit": {
            "type": "string"
          },
          "stockQty": {
            "type": "number"
          },
          "lowStockQty": {
            "type": "number"
          },
          "sellingPrice": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [
          "sku",
          "name",
          "category",
          "unit",
          "stockQty",
          "lowStockQty"
        ],
        "additionalProperties": false
      },
      "D4": {
        "type": "object",
        "properties": {
          "version": {
            "const": 2
          },
          "roles": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D5"
            }
          },
          "rolePageAccess": {
            "$ref": "#/$defs/D6"
          },
          "businessSettings": {
            "$ref": "#/$defs/D7"
          },
          "appTheme": {
            "$ref": "#/$defs/D16"
          },
          "logs": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D17"
            }
          },
          "importBatches": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D19"
            }
          },
          "sessionInventory": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D21"
            }
          },
          "reportTemplates": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D22"
            }
          },
          "companyAssets": {
            "$ref": "#/$defs/D23"
          }
        },
        "required": [
          "version",
          "roles",
          "rolePageAccess",
          "businessSettings",
          "appTheme",
          "logs",
          "importBatches",
          "sessionInventory",
          "reportTemplates",
          "companyAssets"
        ],
        "additionalProperties": false
      },
      "D5": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "label": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "systemRole": {
            "anyOf": [
              {
                "const": "admin"
              },
              {
                "const": "service"
              },
              {
                "const": "service_manager"
              },
              {
                "const": "reception"
              },
              {
                "const": "accounts"
              },
              {
                "const": "store"
              },
              {
                "const": "tech"
              }
            ]
          },
          "isBuiltIn": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "status": {
            "anyOf": [
              {
                "const": "active"
              },
              {
                "const": "archived"
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "updatedAt": {
            "type": "string"
          },
          "archivedAt": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "id",
          "label",
          "description",
          "isBuiltIn",
          "status",
          "createdAt",
          "updatedAt"
        ],
        "additionalProperties": false
      },
      "D6": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "type": "array",
          "items": {
            "anyOf": [
              {
                "const": "receive-vehicle"
              },
              {
                "const": "advance-bookings"
              },
              {
                "const": "today-queue"
              },
              {
                "const": "customers"
              },
              {
                "const": "vehicles"
              },
              {
                "const": "search"
              },
              {
                "const": "my-queue"
              },
              {
                "const": "job-card"
              },
              {
                "const": "estimate"
              },
              {
                "const": "follow-ups"
              },
              {
                "const": "media"
              },
              {
                "const": "material-requests"
              },
              {
                "const": "issue-material"
              },
              {
                "const": "reconcile"
              },
              {
                "const": "stock"
              },
              {
                "const": "approvals"
              },
              {
                "const": "inward-purchases"
              },
              {
                "const": "my-tasks"
              },
              {
                "const": "work-update"
              },
              {
                "const": "qc-prep"
              },
              {
                "const": "ready-to-invoice"
              },
              {
                "const": "invoice"
              },
              {
                "const": "payment"
              },
              {
                "const": "delivery"
              },
              {
                "const": "dashboard"
              },
              {
                "const": "data-flow"
              },
              {
                "const": "jobs"
              },
              {
                "const": "manage"
              },
              {
                "const": "admin-console"
              },
              {
                "const": "sales-leads"
              },
              {
                "const": "quotations"
              },
              {
                "const": "quotation-settings"
              }
            ]
          }
        }
      },
      "D7": {
        "type": "object",
        "properties": {
          "profile": {
            "$ref": "#/$defs/D8"
          },
          "branch": {
            "$ref": "#/$defs/D9"
          },
          "jobs": {
            "$ref": "#/$defs/D10"
          },
          "pricing": {
            "$ref": "#/$defs/D11"
          },
          "billing": {
            "$ref": "#/$defs/D12"
          },
          "inventory": {
            "$ref": "#/$defs/D13"
          },
          "notifications": {
            "$ref": "#/$defs/D14"
          },
          "logRetention": {
            "$ref": "#/$defs/D15"
          }
        },
        "required": [
          "profile",
          "branch",
          "jobs",
          "pricing",
          "billing",
          "inventory",
          "notifications",
          "logRetention"
        ],
        "additionalProperties": false
      },
      "D8": {
        "type": "object",
        "properties": {
          "businessName": {
            "type": "string"
          },
          "legalName": {
            "type": "string"
          },
          "phone": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "address": {
            "type": "string"
          },
          "footer": {
            "type": "string"
          },
          "timezone": {
            "type": "string"
          },
          "currency": {
            "type": "string"
          }
        },
        "required": [
          "businessName",
          "legalName",
          "phone",
          "email",
          "address",
          "footer",
          "timezone",
          "currency"
        ],
        "additionalProperties": false
      },
      "D9": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "openingTime": {
            "type": "string"
          },
          "closingTime": {
            "type": "string"
          },
          "workingDays": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "holidayBehavior": {
            "anyOf": [
              {
                "const": "closed"
              },
              {
                "const": "appointment-only"
              }
            ]
          }
        },
        "required": [
          "name",
          "openingTime",
          "closingTime",
          "workingDays",
          "holidayBehavior"
        ],
        "additionalProperties": false
      },
      "D10": {
        "type": "object",
        "properties": {
          "jobNumberPrefix": {
            "type": "string"
          },
          "defaultPromisedHours": {
            "type": "number"
          },
          "requireQc": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "washingDefault": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "autoCloseAfterDelivery": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "jobNumberPrefix",
          "defaultPromisedHours",
          "requireQc",
          "washingDefault",
          "autoCloseAfterDelivery"
        ],
        "additionalProperties": false
      },
      "D11": {
        "type": "object",
        "properties": {
          "estimateValidityDays": {
            "type": "number"
          },
          "defaultLabourRate": {
            "type": "number"
          },
          "discountApprovalPercent": {
            "type": "number"
          },
          "requireEstimateApproval": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "estimateValidityDays",
          "defaultLabourRate",
          "discountApprovalPercent",
          "requireEstimateApproval"
        ],
        "additionalProperties": false
      },
      "D12": {
        "type": "object",
        "properties": {
          "gstin": {
            "type": "string"
          },
          "bankAccountHolder": {
            "type": "string"
          },
          "bankName": {
            "type": "string"
          },
          "bankAccountNumber": {
            "type": "string"
          },
          "bankIfsc": {
            "type": "string"
          },
          "bankBranch": {
            "type": "string"
          },
          "upiId": {
            "type": "string"
          },
          "defaultGstPercent": {
            "type": "number"
          },
          "invoicePrefix": {
            "type": "string"
          },
          "receiptPrefix": {
            "type": "string"
          },
          "gatePassPrefix": {
            "type": "string"
          },
          "paymentModes": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "required": [
          "gstin",
          "bankAccountHolder",
          "bankName",
          "bankAccountNumber",
          "bankIfsc",
          "bankBranch",
          "upiId",
          "defaultGstPercent",
          "invoicePrefix",
          "receiptPrefix",
          "gatePassPrefix",
          "paymentModes"
        ],
        "additionalProperties": false
      },
      "D13": {
        "type": "object",
        "properties": {
          "defaultUnit": {
            "type": "string"
          },
          "lowStockNotifications": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "requireAdjustmentReason": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          }
        },
        "required": [
          "defaultUnit",
          "lowStockNotifications",
          "requireAdjustmentReason"
        ],
        "additionalProperties": false
      },
      "D14": {
        "type": "object",
        "properties": {
          "customerChannels": {
            "type": "array",
            "items": {
              "anyOf": [
                {
                  "const": "sms"
                },
                {
                  "const": "email"
                },
                {
                  "const": "whatsapp"
                }
              ]
            }
          },
          "documentHeader": {
            "type": "string"
          },
          "estimateTemplate": {
            "type": "string"
          },
          "invoiceTemplate": {
            "type": "string"
          },
          "jobCardCreatedWhatsAppTemplate": {
            "type": "string"
          },
          "jobCardCreatedEmailTemplate": {
            "type": "string"
          },
          "jobCardClosedWhatsAppTemplate": {
            "type": "string"
          },
          "jobCardClosedEmailTemplate": {
            "type": "string"
          }
        },
        "required": [
          "customerChannels",
          "documentHeader",
          "estimateTemplate",
          "invoiceTemplate",
          "jobCardCreatedWhatsAppTemplate",
          "jobCardCreatedEmailTemplate",
          "jobCardClosedWhatsAppTemplate",
          "jobCardClosedEmailTemplate"
        ],
        "additionalProperties": false
      },
      "D15": {
        "type": "object",
        "properties": {
          "operationalDays": {
            "type": "number"
          },
          "featureDays": {
            "type": "number"
          }
        },
        "required": [
          "operationalDays",
          "featureDays"
        ],
        "additionalProperties": false
      },
      "D16": {
        "type": "object",
        "properties": {
          "fontId": {
            "anyOf": [
              {
                "const": "system"
              },
              {
                "const": "arial"
              },
              {
                "const": "verdana"
              },
              {
                "const": "trebuchet"
              },
              {
                "const": "georgia"
              }
            ]
          },
          "paletteId": {
            "anyOf": [
              {
                "const": "go-lite"
              },
              {
                "const": "go-yellow"
              },
              {
                "const": "go-orange"
              },
              {
                "const": "go-blue"
              }
            ]
          }
        },
        "required": [
          "fontId",
          "paletteId"
        ],
        "additionalProperties": false
      },
      "D17": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "stream": {
            "anyOf": [
              {
                "const": "operational"
              },
              {
                "const": "feature"
              }
            ]
          },
          "timestamp": {
            "type": "string"
          },
          "level": {
            "anyOf": [
              {
                "const": "info"
              },
              {
                "const": "warning"
              },
              {
                "const": "error"
              }
            ]
          },
          "area": {
            "type": "string"
          },
          "feature": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "userId": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "userName": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "referenceId": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "details": {
            "anyOf": [
              {
                "$ref": "#/$defs/D18"
              }
            ]
          }
        },
        "required": [
          "id",
          "stream",
          "timestamp",
          "level",
          "area",
          "feature",
          "message"
        ],
        "additionalProperties": false
      },
      "D18": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": {
          "x-unverified": "unknown"
        }
      },
      "D19": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "fileName": {
            "type": "string"
          },
          "status": {
            "anyOf": [
              {
                "const": "mapping"
              },
              {
                "const": "validated"
              },
              {
                "const": "imported"
              },
              {
                "const": "failed"
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "importedAt": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "totalRows": {
            "type": "number"
          },
          "acceptedRows": {
            "type": "number"
          },
          "rejectedRows": {
            "type": "number"
          },
          "columnMapping": {
            "$ref": "#/$defs/D2"
          },
          "errors": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D20"
            }
          }
        },
        "required": [
          "id",
          "fileName",
          "status",
          "createdAt",
          "totalRows",
          "acceptedRows",
          "rejectedRows",
          "columnMapping",
          "errors"
        ],
        "additionalProperties": false
      },
      "D20": {
        "type": "object",
        "properties": {
          "row": {
            "type": "number"
          },
          "field": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "message": {
            "type": "string"
          }
        },
        "required": [
          "row",
          "message"
        ],
        "additionalProperties": false
      },
      "D21": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "importBatchId": {
            "type": "string"
          },
          "sku": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "category": {
            "type": "string"
          },
          "unit": {
            "type": "string"
          },
          "stockQty": {
            "type": "number"
          },
          "lowStockQty": {
            "type": "number"
          },
          "sellingPrice": {
            "type": "number"
          },
          "importedAt": {
            "type": "string"
          }
        },
        "required": [
          "id",
          "importBatchId",
          "sku",
          "name",
          "category",
          "unit",
          "stockQty",
          "lowStockQty",
          "sellingPrice",
          "importedAt"
        ],
        "additionalProperties": false
      },
      "D22": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "category": {
            "anyOf": [
              {
                "const": "job-card"
              },
              {
                "const": "estimate"
              },
              {
                "const": "invoice"
              },
              {
                "const": "quotation"
              },
              {
                "const": "gate-pass"
              },
              {
                "const": "payment-receipt"
              }
            ]
          },
          "name": {
            "type": "string"
          },
          "html": {
            "type": "string"
          },
          "active": {
            "anyOf": [
              {
                "const": false
              },
              {
                "const": true
              }
            ]
          },
          "createdAt": {
            "type": "string"
          },
          "updatedAt": {
            "type": "string"
          },
          "seedVersion": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [
          "id",
          "category",
          "name",
          "html",
          "active",
          "createdAt",
          "updatedAt"
        ],
        "additionalProperties": false
      },
      "D23": {
        "type": "object",
        "properties": {
          "logo": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          },
          "stamp": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          },
          "authorizedSignature": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "logo",
          "stamp",
          "authorizedSignature"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": [
      "unknown"
    ]
  },
  {
    "operation": "OP-db-setAdvisorPresent",
    "route": "POST /api/v1/ui/commands/setAdvisorPresent",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "number"
            },
            "present": {
              "anyOf": [
                {
                  "const": false
                },
                {
                  "const": true
                }
              ]
            },
            "date": {
              "type": "string"
            }
          },
          "required": [
            "userId",
            "present"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-assignAdvisor",
    "route": "POST /api/v1/ui/commands/assignAdvisor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "jobId": {
              "type": "number"
            },
            "advisorId": {
              "type": "number"
            }
          },
          "required": [
            "jobId",
            "advisorId"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-createUser",
    "route": "POST /api/v1/ui/commands/createUser",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "payload": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "payload"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "email": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "role": {
            "anyOf": [
              {
                "const": "admin"
              },
              {
                "const": "service"
              },
              {
                "const": "service_manager"
              },
              {
                "const": "reception"
              },
              {
                "const": "accounts"
              },
              {
                "const": "store"
              },
              {
                "const": "tech"
              }
            ]
          },
          "password": {
            "type": "string"
          }
        },
        "required": [
          "email",
          "name",
          "role",
          "password"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-updateUser",
    "route": "POST /api/v1/ui/commands/updateUser",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "payload": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "id",
            "payload"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "email": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "role": {
            "anyOf": [
              {
                "const": "admin"
              },
              {
                "const": "service"
              },
              {
                "const": "service_manager"
              },
              {
                "const": "reception"
              },
              {
                "const": "accounts"
              },
              {
                "const": "store"
              },
              {
                "const": "tech"
              }
            ]
          },
          "password": {
            "type": "string"
          }
        },
        "required": [
          "email",
          "name",
          "role",
          "password"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-archiveUser",
    "route": "POST /api/v1/ui/commands/archiveUser",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "reason": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "reason"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-createCustomer",
    "route": "POST /api/v1/ui/commands/createCustomer",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "payload": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "payload"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "mobile": {
            "type": "string"
          },
          "type": {
            "type": "string"
          },
          "address": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "name",
          "mobile",
          "type"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-updateCustomer",
    "route": "POST /api/v1/ui/commands/updateCustomer",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "payload": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "id",
            "payload"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "mobile": {
            "type": "string"
          },
          "type": {
            "type": "string"
          },
          "address": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "name",
          "mobile",
          "type"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-archiveCustomer",
    "route": "POST /api/v1/ui/commands/archiveCustomer",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "reason": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "reason"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-createVehicle",
    "route": "POST /api/v1/ui/commands/createVehicle",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "payload": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "payload"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "number": {
            "type": "string"
          },
          "customer_id": {
            "type": "number"
          },
          "make": {
            "type": "string"
          },
          "model": {
            "type": "string"
          },
          "color": {
            "type": "string"
          },
          "km": {
            "type": "number"
          },
          "engine_no": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "archived_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "archived_reason": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "created_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "updated_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "number",
          "customer_id",
          "make",
          "model",
          "color",
          "km"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-updateVehicle",
    "route": "POST /api/v1/ui/commands/updateVehicle",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "payload": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "id",
            "payload"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "number": {
            "type": "string"
          },
          "customer_id": {
            "type": "number"
          },
          "make": {
            "type": "string"
          },
          "model": {
            "type": "string"
          },
          "color": {
            "type": "string"
          },
          "km": {
            "type": "number"
          },
          "engine_no": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "archived_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "archived_reason": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "created_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "updated_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "number",
          "customer_id",
          "make",
          "model",
          "color",
          "km"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-archiveVehicle",
    "route": "POST /api/v1/ui/commands/archiveVehicle",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "reason": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "reason"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-updateVisit",
    "route": "POST /api/v1/ui/commands/updateVisit",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "payload": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "id",
            "payload"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "advisor_id": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "fuel": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "keys": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "accessories": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "requested_work": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "photos_note": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-setBookingCapacityForDate",
    "route": "POST /api/v1/ui/commands/setBookingCapacityForDate",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "bookingDate": {
              "type": "string"
            },
            "capacities": {
              "$ref": "#/$defs/D1"
            },
            "timestamp": {
              "type": "string"
            }
          },
          "required": [
            "bookingDate",
            "capacities"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "serviceWork": {
            "type": "number"
          },
          "generalCheckupFollowup": {
            "type": "number"
          }
        },
        "required": [
          "serviceWork",
          "generalCheckupFollowup"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-createBooking",
    "route": "POST /api/v1/ui/commands/createBooking",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "input": {
              "$ref": "#/$defs/D1"
            },
            "timestamp": {
              "type": "string"
            }
          },
          "required": [
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "customerId": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "vehicleId": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "customerName": {
            "type": "string"
          },
          "mobile": {
            "type": "string"
          },
          "customerType": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "vehicleNo": {
            "type": "string"
          },
          "make": {
            "type": "string"
          },
          "model": {
            "type": "string"
          },
          "color": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "requestedWork": {
            "type": "string"
          },
          "serviceType": {
            "anyOf": [
              {
                "const": "Service Work"
              },
              {
                "const": "General Checkup / Follow-up"
              }
            ]
          },
          "bookingDate": {
            "type": "string"
          },
          "arrivalWindow": {
            "anyOf": [
              {
                "const": ""
              },
              {
                "const": "Morning"
              },
              {
                "const": "Afternoon"
              },
              {
                "const": "Evening"
              }
            ]
          },
          "capacityOverrideReason": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "customerName",
          "mobile",
          "vehicleNo",
          "make",
          "model",
          "requestedWork",
          "serviceType",
          "bookingDate"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-updateBooking",
    "route": "POST /api/v1/ui/commands/updateBooking",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "bookingId": {
              "type": "number"
            },
            "input": {
              "$ref": "#/$defs/D1"
            },
            "timestamp": {
              "type": "string"
            }
          },
          "required": [
            "bookingId",
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "customerId": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "vehicleId": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "customerName": {
            "type": "string"
          },
          "mobile": {
            "type": "string"
          },
          "customerType": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "vehicleNo": {
            "type": "string"
          },
          "make": {
            "type": "string"
          },
          "model": {
            "type": "string"
          },
          "color": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "requestedWork": {
            "type": "string"
          },
          "serviceType": {
            "anyOf": [
              {
                "const": "Service Work"
              },
              {
                "const": "General Checkup / Follow-up"
              }
            ]
          },
          "bookingDate": {
            "type": "string"
          },
          "arrivalWindow": {
            "anyOf": [
              {
                "const": ""
              },
              {
                "const": "Morning"
              },
              {
                "const": "Afternoon"
              },
              {
                "const": "Evening"
              }
            ]
          },
          "capacityOverrideReason": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "customerName",
          "mobile",
          "vehicleNo",
          "make",
          "model",
          "requestedWork",
          "serviceType",
          "bookingDate"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-confirmBooking",
    "route": "POST /api/v1/ui/commands/confirmBooking",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "bookingId": {
              "type": "number"
            },
            "timestamp": {
              "type": "string"
            }
          },
          "required": [
            "bookingId"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-rescheduleBooking",
    "route": "POST /api/v1/ui/commands/rescheduleBooking",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "bookingId": {
              "type": "number"
            },
            "bookingDate": {
              "type": "string"
            },
            "reason": {
              "type": "string"
            },
            "arrivalWindow": {
              "anyOf": [
                {
                  "const": ""
                },
                {
                  "const": "Morning"
                },
                {
                  "const": "Afternoon"
                },
                {
                  "const": "Evening"
                }
              ]
            },
            "timestamp": {
              "type": "string"
            },
            "capacityOverrideReason": {
              "anyOf": [
                {
                  "type": "string"
                }
              ]
            }
          },
          "required": [
            "bookingId",
            "bookingDate",
            "reason"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-cancelBooking",
    "route": "POST /api/v1/ui/commands/cancelBooking",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "bookingId": {
              "type": "number"
            },
            "reason": {
              "type": "string"
            },
            "timestamp": {
              "type": "string"
            }
          },
          "required": [
            "bookingId",
            "reason"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-markBookingNoShow",
    "route": "POST /api/v1/ui/commands/markBookingNoShow",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "bookingId": {
              "type": "number"
            },
            "reason": {
              "type": "string"
            },
            "timestamp": {
              "type": "string"
            }
          },
          "required": [
            "bookingId",
            "reason"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-recordBookingCall",
    "route": "POST /api/v1/ui/commands/recordBookingCall",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "bookingId": {
              "type": "number"
            },
            "note": {
              "type": "string"
            },
            "timestamp": {
              "type": "string"
            }
          },
          "required": [
            "bookingId",
            "note"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-checkInBooking",
    "route": "POST /api/v1/ui/commands/checkInBooking",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "bookingId": {
              "type": "number"
            },
            "receptionId": {
              "type": "number"
            },
            "input": {
              "$ref": "#/$defs/D1"
            },
            "timestamp": {
              "type": "string"
            }
          },
          "required": [
            "bookingId",
            "receptionId",
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "$ref": "#/$defs/D2"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "odoReading": {
            "type": "number"
          },
          "fuelLevelValue": {
            "type": "string"
          },
          "fuelLevelUnit": {
            "anyOf": [
              {
                "const": "bars"
              },
              {
                "const": "%"
              },
              {
                "const": "litres"
              },
              {
                "const": "Other"
              }
            ]
          },
          "keys": {
            "type": "string"
          },
          "accessories": {
            "type": "string"
          },
          "requestedWork": {
            "type": "string"
          },
          "damageMarks": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "odoReading",
          "fuelLevelValue",
          "fuelLevelUnit",
          "keys",
          "accessories",
          "requestedWork"
        ],
        "additionalProperties": false
      },
      "D2": {
        "type": "object",
        "properties": {
          "jobId": {
            "type": "number"
          },
          "visitId": {
            "type": "number"
          }
        },
        "required": [
          "jobId",
          "visitId"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-receiveVehicle",
    "route": "POST /api/v1/ui/commands/receiveVehicle",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "payload": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "payload"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "customerId": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "vehicleId": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "customerName": {
            "type": "string"
          },
          "mobile": {
            "type": "string"
          },
          "customerType": {
            "type": "string"
          },
          "vehicleNo": {
            "type": "string"
          },
          "make": {
            "type": "string"
          },
          "model": {
            "type": "string"
          },
          "color": {
            "type": "string"
          },
          "km": {
            "type": "number"
          },
          "fuel": {
            "type": "string"
          },
          "odoReading": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "fuelLevelValue": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "fuelLevelUnit": {
            "anyOf": [
              {
                "const": "bars"
              },
              {
                "const": "%"
              },
              {
                "const": "litres"
              },
              {
                "const": "Other"
              }
            ]
          },
          "keys": {
            "type": "string"
          },
          "accessories": {
            "type": "string"
          },
          "requestedWork": {
            "type": "string"
          },
          "advisorId": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "receptionId": {
            "type": "number"
          },
          "damageMarks": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "address": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "engineNo": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "serviceType": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "pickupDrop": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "estimatedDelivery": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "customerName",
          "mobile",
          "customerType",
          "vehicleNo",
          "make",
          "model",
          "color",
          "km",
          "fuel",
          "keys",
          "accessories",
          "requestedWork",
          "receptionId"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-createServiceCatalogItemForActor",
    "route": "POST /api/v1/ui/commands/createServiceCatalogItemForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "base_rate": {
            "type": "number"
          },
          "service_department_id": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "number"
              }
            ]
          },
          "brand_id": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "number"
              }
            ]
          },
          "car_segment_id": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "number"
              }
            ]
          },
          "gst_rate": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [
          "name",
          "base_rate"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-updateServiceCatalogItemForActor",
    "route": "POST /api/v1/ui/commands/updateServiceCatalogItemForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "id",
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "base_rate": {
            "type": "number"
          },
          "service_department_id": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "number"
              }
            ]
          },
          "brand_id": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "number"
              }
            ]
          },
          "car_segment_id": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "number"
              }
            ]
          },
          "gst_rate": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [
          "name",
          "base_rate"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-archiveServiceCatalogItemForActor",
    "route": "POST /api/v1/ui/commands/archiveServiceCatalogItemForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-addJobTaskListItemForActor",
    "route": "POST /api/v1/ui/commands/addJobTaskListItemForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "jobId": {
              "type": "number"
            },
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "jobId",
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "service_catalog_item_id": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "name": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "base_rate": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "gst_rate": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-updateJobTaskListItemForActor",
    "route": "POST /api/v1/ui/commands/updateJobTaskListItemForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "id",
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "base_rate": {
            "type": "number"
          },
          "done": {
            "type": "number"
          }
        },
        "required": [
          "name",
          "base_rate",
          "done"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-archiveJobTaskListItemForActor",
    "route": "POST /api/v1/ui/commands/archiveJobTaskListItemForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-prefillEstimateFromTaskListForActor",
    "route": "POST /api/v1/ui/commands/prefillEstimateFromTaskListForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "jobId": {
              "type": "number"
            }
          },
          "required": [
            "jobId"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-transitionJobStatusForActor",
    "route": "POST /api/v1/ui/commands/transitionJobStatusForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "jobId": {
              "type": "number"
            },
            "to": {
              "anyOf": [
                {
                  "const": "NEW"
                },
                {
                  "const": "IN_PROGRESS"
                },
                {
                  "const": "HOLD"
                },
                {
                  "const": "COMPLETED"
                },
                {
                  "const": "CLOSED"
                },
                {
                  "const": "CANCELLED"
                }
              ]
            },
            "note": {
              "type": "string"
            },
            "timestamp": {
              "type": "string"
            }
          },
          "required": [
            "jobId",
            "to",
            "note"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-saveEstimateForActor",
    "route": "POST /api/v1/ui/commands/saveEstimateForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "jobId": {
              "type": "number"
            },
            "draft": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "jobId",
            "draft"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "discount": {
            "type": "number"
          },
          "gst_rate": {
            "type": "number"
          },
          "notes": {
            "type": "string"
          },
          "items": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D2"
            }
          }
        },
        "required": [
          "discount",
          "gst_rate",
          "notes",
          "items"
        ],
        "additionalProperties": false
      },
      "D2": {
        "type": "object",
        "properties": {
          "kind": {
            "anyOf": [
              {
                "const": "Service"
              },
              {
                "const": "Material"
              }
            ]
          },
          "description": {
            "type": "string"
          },
          "qty": {
            "type": "number"
          },
          "rate": {
            "type": "number"
          },
          "gst_type": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "const": "CGST+SGST"
              },
              {
                "const": "IGST"
              },
              {
                "const": "No GST"
              }
            ]
          },
          "gst_rate": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [
          "kind",
          "description",
          "qty",
          "rate"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-updateJobCardForActor",
    "route": "POST /api/v1/ui/commands/updateJobCardForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "jobId": {
              "type": "number"
            },
            "payload": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "jobId",
            "payload"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "advisor_id": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "technician_id": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "work_list": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "promised_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "advisor_notes": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "customer_instructions": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "internal_instructions": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-saveJobDetailsForActor",
    "route": "POST /api/v1/ui/commands/saveJobDetailsForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "jobId": {
              "type": "number"
            },
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "jobId",
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "advisor_id": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "technician_id": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "work_list": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "promised_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "advisor_notes": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "customer_instructions": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "internal_instructions": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "service_type": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "pickup_drop": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "estimated_delivery": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "fuel": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "accessories": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "engine_no": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "address": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-updateJobSheetForActor",
    "route": "POST /api/v1/ui/commands/updateJobSheetForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "jobId": {
              "type": "number"
            },
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "jobId",
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "service_type": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "pickup_drop": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "estimated_delivery": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "fuel": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "accessories": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "engine_no": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "address": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-updateEstimatedDeliveryForActor",
    "route": "POST /api/v1/ui/commands/updateEstimatedDeliveryForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "jobId": {
              "type": "number"
            },
            "estimatedDelivery": {
              "type": "string"
            }
          },
          "required": [
            "jobId",
            "estimatedDelivery"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-setDamageMarksForActor",
    "route": "POST /api/v1/ui/commands/setDamageMarksForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "jobId": {
              "type": "number"
            },
            "marks": {
              "type": "array",
              "items": {
                "$ref": "#/$defs/D1"
              }
            }
          },
          "required": [
            "jobId",
            "marks"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "id": {
            "type": "number"
          },
          "x": {
            "type": "number"
          },
          "y": {
            "type": "number"
          },
          "view": {
            "anyOf": [
              {
                "const": "LF"
              },
              {
                "const": "LR"
              },
              {
                "const": "RF"
              },
              {
                "const": "RR"
              }
            ]
          }
        },
        "required": [
          "id",
          "x",
          "y"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-cancelJobCard",
    "route": "POST /api/v1/ui/commands/cancelJobCard",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "jobId": {
              "type": "number"
            },
            "reason": {
              "type": "string"
            }
          },
          "required": [
            "jobId",
            "reason"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-archiveJobCardForActor",
    "route": "POST /api/v1/ui/commands/archiveJobCardForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "jobId": {
              "type": "number"
            },
            "reason": {
              "type": "string"
            }
          },
          "required": [
            "jobId",
            "reason"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-cancelJobCardStatus",
    "route": "POST /api/v1/ui/commands/cancelJobCardStatus",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "jobId": {
              "type": "number"
            },
            "note": {
              "type": "string"
            }
          },
          "required": [
            "jobId",
            "note"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-createEstimate",
    "route": "POST /api/v1/ui/commands/createEstimate",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "jobId": {
              "type": "number"
            }
          },
          "required": [
            "jobId"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-updateEstimate",
    "route": "POST /api/v1/ui/commands/updateEstimate",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "payload": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "id",
            "payload"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "gst_rate": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "status": {
            "anyOf": [
              {
                "const": "Approved"
              },
              {
                "const": "Draft"
              }
            ]
          },
          "discount": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "approval_note": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-createEstimateItem",
    "route": "POST /api/v1/ui/commands/createEstimateItem",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "payload": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "payload"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "archived_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "archived_reason": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "created_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "updated_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "kind": {
            "anyOf": [
              {
                "const": "Service"
              },
              {
                "const": "Material"
              }
            ]
          },
          "description": {
            "type": "string"
          },
          "qty": {
            "type": "number"
          },
          "rate": {
            "type": "number"
          },
          "gst_type": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "const": "CGST+SGST"
              },
              {
                "const": "IGST"
              },
              {
                "const": "No GST"
              }
            ]
          },
          "gst_rate": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "number"
              }
            ]
          },
          "estimate_id": {
            "type": "number"
          },
          "task_list_item_id": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [
          "kind",
          "description",
          "qty",
          "rate",
          "estimate_id"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-updateEstimateItem",
    "route": "POST /api/v1/ui/commands/updateEstimateItem",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "payload": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "id",
            "payload"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "archived_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "archived_reason": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "created_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "updated_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "kind": {
            "anyOf": [
              {
                "const": "Service"
              },
              {
                "const": "Material"
              }
            ]
          },
          "description": {
            "type": "string"
          },
          "qty": {
            "type": "number"
          },
          "rate": {
            "type": "number"
          },
          "gst_type": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "const": "CGST+SGST"
              },
              {
                "const": "IGST"
              },
              {
                "const": "No GST"
              }
            ]
          },
          "gst_rate": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "number"
              }
            ]
          },
          "estimate_id": {
            "type": "number"
          },
          "task_list_item_id": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [
          "kind",
          "description",
          "qty",
          "rate",
          "estimate_id"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-archiveEstimateItem",
    "route": "POST /api/v1/ui/commands/archiveEstimateItem",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "reason": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "reason"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-approveEstimateForActor",
    "route": "POST /api/v1/ui/commands/approveEstimateForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "jobId": {
              "type": "number"
            },
            "note": {
              "type": "string"
            }
          },
          "required": [
            "jobId",
            "note"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-createMaterialRequest",
    "route": "POST /api/v1/ui/commands/createMaterialRequest",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "payload": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "payload"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "archived_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "archived_reason": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "created_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "updated_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "status": {
            "anyOf": [
              {
                "const": "Draft"
              },
              {
                "const": "Requested"
              },
              {
                "const": "Re-requested"
              },
              {
                "const": "Issued"
              },
              {
                "const": "Cancelled"
              }
            ]
          },
          "job_card_id": {
            "type": "number"
          },
          "item_id": {
            "type": "number"
          },
          "requested_qty": {
            "type": "number"
          },
          "issued_qty": {
            "type": "number"
          },
          "used_qty": {
            "type": "number"
          },
          "returned_qty": {
            "type": "number"
          },
          "wasted_qty": {
            "type": "number"
          },
          "invoiced_in": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "number"
              }
            ]
          },
          "note": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "job_card_id",
          "item_id",
          "requested_qty",
          "issued_qty",
          "used_qty",
          "returned_qty",
          "wasted_qty"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-updateMaterialRequest",
    "route": "POST /api/v1/ui/commands/updateMaterialRequest",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "payload": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "id",
            "payload"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "archived_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "archived_reason": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "created_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "updated_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "status": {
            "anyOf": [
              {
                "const": "Draft"
              },
              {
                "const": "Requested"
              },
              {
                "const": "Re-requested"
              },
              {
                "const": "Issued"
              },
              {
                "const": "Cancelled"
              }
            ]
          },
          "job_card_id": {
            "type": "number"
          },
          "item_id": {
            "type": "number"
          },
          "requested_qty": {
            "type": "number"
          },
          "issued_qty": {
            "type": "number"
          },
          "used_qty": {
            "type": "number"
          },
          "returned_qty": {
            "type": "number"
          },
          "wasted_qty": {
            "type": "number"
          },
          "invoiced_in": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "number"
              }
            ]
          },
          "note": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "job_card_id",
          "item_id",
          "requested_qty",
          "issued_qty",
          "used_qty",
          "returned_qty",
          "wasted_qty"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-archiveMaterialRequest",
    "route": "POST /api/v1/ui/commands/archiveMaterialRequest",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "reason": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "reason"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-createLocalPurchase",
    "route": "POST /api/v1/ui/commands/createLocalPurchase",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "payload": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "payload"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "job_card_id": {
            "type": "number"
          },
          "note": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "item_description": {
            "type": "string"
          },
          "quantity": {
            "type": "number"
          },
          "unit": {
            "type": "string"
          },
          "unit_cost": {
            "type": "number"
          },
          "vendor": {
            "type": "string"
          },
          "bill_reference": {
            "type": "string"
          }
        },
        "required": [
          "job_card_id",
          "item_description",
          "quantity",
          "unit",
          "unit_cost",
          "vendor",
          "bill_reference"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-updateLocalPurchase",
    "route": "POST /api/v1/ui/commands/updateLocalPurchase",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "payload": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "id",
            "payload"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "job_card_id": {
            "type": "number"
          },
          "note": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "item_description": {
            "type": "string"
          },
          "quantity": {
            "type": "number"
          },
          "unit": {
            "type": "string"
          },
          "unit_cost": {
            "type": "number"
          },
          "vendor": {
            "type": "string"
          },
          "bill_reference": {
            "type": "string"
          }
        },
        "required": [
          "job_card_id",
          "item_description",
          "quantity",
          "unit",
          "unit_cost",
          "vendor",
          "bill_reference"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-archiveLocalPurchase",
    "route": "POST /api/v1/ui/commands/archiveLocalPurchase",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "reason": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "reason"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-createMaterialPurchaseRequestForActor",
    "route": "POST /api/v1/ui/commands/createMaterialPurchaseRequestForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "jobId": {
              "type": "number"
            },
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "jobId",
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "item_name": {
            "type": "string"
          },
          "quantity": {
            "type": "number"
          },
          "unit": {
            "type": "string"
          }
        },
        "required": [
          "item_name",
          "quantity",
          "unit"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-purchaseStockAndIssueForActor",
    "route": "POST /api/v1/ui/commands/purchaseStockAndIssueForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "requestId": {
              "type": "number"
            },
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "requestId",
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "inventory_item_id": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "sku": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "category": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "unit_cost": {
            "type": "number"
          },
          "vendor": {
            "type": "string"
          },
          "bill_reference": {
            "type": "string"
          },
          "note": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "unit_cost",
          "vendor",
          "bill_reference"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-createSupplierForActor",
    "route": "POST /api/v1/ui/commands/createSupplierForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "contact_name": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "phone": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "email": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "gstin": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "status": {
            "anyOf": [
              {
                "const": "Active"
              },
              {
                "const": "On hold"
              },
              {
                "const": "Archived"
              }
            ]
          }
        },
        "required": [
          "name"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-updateSupplierForActor",
    "route": "POST /api/v1/ui/commands/updateSupplierForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "id",
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "contact_name": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "phone": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "email": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "gstin": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "status": {
            "anyOf": [
              {
                "const": "Active"
              },
              {
                "const": "On hold"
              },
              {
                "const": "Archived"
              }
            ]
          }
        },
        "required": [
          "name"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-archiveSupplierForActor",
    "route": "POST /api/v1/ui/commands/archiveSupplierForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-createInwardPurchaseDraft",
    "route": "POST /api/v1/ui/commands/createInwardPurchaseDraft",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "supplier_id": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "supplier_invoice_no": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "invoice_date": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "po_number": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "lines": {
            "anyOf": [
              {
                "type": "array",
                "items": {
                  "$ref": "#/$defs/D2"
                }
              }
            ]
          },
          "attachments": {
            "anyOf": [
              {
                "type": "array",
                "items": {
                  "$ref": "#/$defs/D3"
                }
              }
            ]
          }
        },
        "required": [],
        "additionalProperties": false
      },
      "D2": {
        "type": "object",
        "properties": {
          "purchase_order_line_id": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "number"
              }
            ]
          },
          "item_id": {
            "type": "number"
          },
          "received_qty": {
            "type": "number"
          },
          "unit_cost": {
            "type": "number"
          },
          "discount": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "gst_rate": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [
          "item_id",
          "received_qty",
          "unit_cost"
        ],
        "additionalProperties": false
      },
      "D3": {
        "type": "object",
        "properties": {
          "original_name": {
            "type": "string"
          },
          "mime_type": {
            "type": "string"
          },
          "byte_size": {
            "type": "number"
          },
          "document_url": {
            "type": "string"
          }
        },
        "required": [
          "original_name",
          "mime_type",
          "byte_size",
          "document_url"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-updateInwardPurchaseDraftForActor",
    "route": "POST /api/v1/ui/commands/updateInwardPurchaseDraftForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "purchaseId": {
              "type": "number"
            },
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "purchaseId",
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "supplier_id": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "supplier_invoice_no": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "invoice_date": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "po_number": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "lines": {
            "anyOf": [
              {
                "type": "array",
                "items": {
                  "$ref": "#/$defs/D2"
                }
              }
            ]
          },
          "attachments": {
            "anyOf": [
              {
                "type": "array",
                "items": {
                  "$ref": "#/$defs/D3"
                }
              }
            ]
          }
        },
        "required": [],
        "additionalProperties": false
      },
      "D2": {
        "type": "object",
        "properties": {
          "purchase_order_line_id": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "number"
              }
            ]
          },
          "item_id": {
            "type": "number"
          },
          "received_qty": {
            "type": "number"
          },
          "unit_cost": {
            "type": "number"
          },
          "discount": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "gst_rate": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [
          "item_id",
          "received_qty",
          "unit_cost"
        ],
        "additionalProperties": false
      },
      "D3": {
        "type": "object",
        "properties": {
          "original_name": {
            "type": "string"
          },
          "mime_type": {
            "type": "string"
          },
          "byte_size": {
            "type": "number"
          },
          "document_url": {
            "type": "string"
          }
        },
        "required": [
          "original_name",
          "mime_type",
          "byte_size",
          "document_url"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-sendInwardPurchaseForPoApprovalForActor",
    "route": "POST /api/v1/ui/commands/sendInwardPurchaseForPoApprovalForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "purchaseId": {
              "type": "number"
            }
          },
          "required": [
            "purchaseId"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-approveInwardPurchaseForActor",
    "route": "POST /api/v1/ui/commands/approveInwardPurchaseForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "purchaseId": {
              "type": "number"
            }
          },
          "required": [
            "purchaseId"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-receiveAndPostInwardPurchaseForActor",
    "route": "POST /api/v1/ui/commands/receiveAndPostInwardPurchaseForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "purchaseId": {
              "type": "number"
            },
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "purchaseId"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "supplier_id": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "supplier_invoice_no": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "invoice_date": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "po_number": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "lines": {
            "anyOf": [
              {
                "type": "array",
                "items": {
                  "$ref": "#/$defs/D2"
                }
              }
            ]
          },
          "attachments": {
            "anyOf": [
              {
                "type": "array",
                "items": {
                  "$ref": "#/$defs/D3"
                }
              }
            ]
          }
        },
        "required": [],
        "additionalProperties": false
      },
      "D2": {
        "type": "object",
        "properties": {
          "purchase_order_line_id": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "number"
              }
            ]
          },
          "item_id": {
            "type": "number"
          },
          "received_qty": {
            "type": "number"
          },
          "unit_cost": {
            "type": "number"
          },
          "discount": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "gst_rate": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [
          "item_id",
          "received_qty",
          "unit_cost"
        ],
        "additionalProperties": false
      },
      "D3": {
        "type": "object",
        "properties": {
          "original_name": {
            "type": "string"
          },
          "mime_type": {
            "type": "string"
          },
          "byte_size": {
            "type": "number"
          },
          "document_url": {
            "type": "string"
          }
        },
        "required": [
          "original_name",
          "mime_type",
          "byte_size",
          "document_url"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-submitInwardPurchaseForActor",
    "route": "POST /api/v1/ui/commands/submitInwardPurchaseForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "purchaseId": {
              "type": "number"
            }
          },
          "required": [
            "purchaseId"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-savePurchaseOrderQuotationForActor",
    "route": "POST /api/v1/ui/commands/savePurchaseOrderQuotationForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "purchaseOrderId": {
              "type": "number"
            },
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "purchaseOrderId",
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "purchase_order_line_id": {
            "type": "number"
          },
          "supplier_name": {
            "type": "string"
          },
          "quote_date": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "quoted_qty": {
            "type": "number"
          },
          "unit_cost": {
            "type": "number"
          },
          "notes": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "purchase_order_line_id",
          "supplier_name",
          "quoted_qty",
          "unit_cost"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-createPurchaseRequestForActor",
    "route": "POST /api/v1/ui/commands/createPurchaseRequestForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "order_date": {
            "type": "string"
          },
          "notes": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "lines": {
            "type": "array",
            "items": {
              "anyOf": [
                {
                  "$ref": "#/$defs/D2"
                },
                {
                  "$ref": "#/$defs/D3"
                }
              ]
            }
          }
        },
        "required": [
          "order_date",
          "lines"
        ],
        "additionalProperties": false
      },
      "D2": {
        "type": "object",
        "properties": {
          "item_id": {
            "type": "number"
          },
          "ordered_qty": {
            "type": "number"
          }
        },
        "required": [
          "item_id",
          "ordered_qty"
        ],
        "additionalProperties": false
      },
      "D3": {
        "type": "object",
        "properties": {
          "item_name": {
            "type": "string"
          },
          "unit": {
            "type": "string"
          },
          "ordered_qty": {
            "type": "number"
          }
        },
        "required": [
          "item_name",
          "unit",
          "ordered_qty"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-updatePurchaseRequestForActor",
    "route": "POST /api/v1/ui/commands/updatePurchaseRequestForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "id",
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "order_date": {
            "type": "string"
          },
          "notes": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "lines": {
            "type": "array",
            "items": {
              "anyOf": [
                {
                  "$ref": "#/$defs/D2"
                },
                {
                  "$ref": "#/$defs/D3"
                }
              ]
            }
          }
        },
        "required": [
          "order_date",
          "lines"
        ],
        "additionalProperties": false
      },
      "D2": {
        "type": "object",
        "properties": {
          "item_id": {
            "type": "number"
          },
          "ordered_qty": {
            "type": "number"
          }
        },
        "required": [
          "item_id",
          "ordered_qty"
        ],
        "additionalProperties": false
      },
      "D3": {
        "type": "object",
        "properties": {
          "item_name": {
            "type": "string"
          },
          "unit": {
            "type": "string"
          },
          "ordered_qty": {
            "type": "number"
          }
        },
        "required": [
          "item_name",
          "unit",
          "ordered_qty"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-cancelPurchaseRequestForActor",
    "route": "POST /api/v1/ui/commands/cancelPurchaseRequestForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-approvePurchaseRequestForActor",
    "route": "POST /api/v1/ui/commands/approvePurchaseRequestForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "purchaseOrderId": {
              "type": "number"
            },
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "purchaseOrderId",
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "array",
      "items": {
        "type": "number"
      }
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "lines": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D2"
            }
          }
        },
        "required": [
          "lines"
        ],
        "additionalProperties": false
      },
      "D2": {
        "type": "object",
        "properties": {
          "purchase_order_line_id": {
            "type": "number"
          },
          "supplier_id": {
            "type": "number"
          },
          "unit_cost": {
            "type": "number"
          },
          "inventory_item": {
            "anyOf": [
              {
                "$ref": "#/$defs/D3"
              }
            ]
          }
        },
        "required": [
          "purchase_order_line_id",
          "supplier_id",
          "unit_cost"
        ],
        "additionalProperties": false
      },
      "D3": {
        "type": "object",
        "properties": {
          "sku": {
            "type": "string"
          },
          "category": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "unit": {
            "type": "string"
          },
          "low_stock_qty": {
            "type": "number"
          },
          "selling_price": {
            "type": "number"
          }
        },
        "required": [
          "sku",
          "category",
          "name",
          "unit",
          "low_stock_qty",
          "selling_price"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-issuePurchaseOrderForActor",
    "route": "POST /api/v1/ui/commands/issuePurchaseOrderForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "purchaseOrderId": {
              "type": "number"
            }
          },
          "required": [
            "purchaseOrderId"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-recordPurchaseOrderReceiptForActor",
    "route": "POST /api/v1/ui/commands/recordPurchaseOrderReceiptForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "purchaseOrderId": {
              "type": "number"
            },
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "purchaseOrderId",
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "note": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "lines": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D2"
            }
          }
        },
        "required": [
          "lines"
        ],
        "additionalProperties": false
      },
      "D2": {
        "type": "object",
        "properties": {
          "purchase_order_line_id": {
            "type": "number"
          },
          "delivered_qty": {
            "type": "number"
          }
        },
        "required": [
          "purchase_order_line_id",
          "delivered_qty"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-confirmPurchaseOrderForActor",
    "route": "POST /api/v1/ui/commands/confirmPurchaseOrderForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "purchaseOrderId": {
              "type": "number"
            },
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "purchaseOrderId",
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "lines": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D2"
            }
          }
        },
        "required": [
          "lines"
        ],
        "additionalProperties": false
      },
      "D2": {
        "type": "object",
        "properties": {
          "purchase_order_line_id": {
            "type": "number"
          },
          "accepted_qty": {
            "type": "number"
          },
          "returned_qty": {
            "type": "number"
          },
          "damaged_qty": {
            "type": "number"
          },
          "wasted_qty": {
            "type": "number"
          }
        },
        "required": [
          "purchase_order_line_id",
          "accepted_qty",
          "returned_qty",
          "damaged_qty",
          "wasted_qty"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-closePurchaseOrderForActor",
    "route": "POST /api/v1/ui/commands/closePurchaseOrderForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "purchaseOrderId": {
              "type": "number"
            }
          },
          "required": [
            "purchaseOrderId"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "array",
      "items": {
        "type": "number"
      }
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-createPurchaseOrderForActor",
    "route": "POST /api/v1/ui/commands/createPurchaseOrderForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "supplier_id": {
            "type": "number"
          },
          "po_number": {
            "type": "string"
          },
          "order_date": {
            "type": "string"
          },
          "notes": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "lines": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D2"
            }
          }
        },
        "required": [
          "supplier_id",
          "po_number",
          "order_date",
          "lines"
        ],
        "additionalProperties": false
      },
      "D2": {
        "type": "object",
        "properties": {
          "item_id": {
            "type": "number"
          },
          "ordered_qty": {
            "type": "number"
          },
          "unit_cost": {
            "type": "number"
          },
          "discount": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "gst_rate": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [
          "item_id",
          "ordered_qty",
          "unit_cost"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-updatePurchaseOrderForActor",
    "route": "POST /api/v1/ui/commands/updatePurchaseOrderForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "id",
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "supplier_id": {
            "type": "number"
          },
          "po_number": {
            "type": "string"
          },
          "order_date": {
            "type": "string"
          },
          "notes": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "lines": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D2"
            }
          }
        },
        "required": [
          "supplier_id",
          "po_number",
          "order_date",
          "lines"
        ],
        "additionalProperties": false
      },
      "D2": {
        "type": "object",
        "properties": {
          "item_id": {
            "type": "number"
          },
          "ordered_qty": {
            "type": "number"
          },
          "unit_cost": {
            "type": "number"
          },
          "discount": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "gst_rate": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [
          "item_id",
          "ordered_qty",
          "unit_cost"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-setPurchaseOrderStatusForActor",
    "route": "POST /api/v1/ui/commands/setPurchaseOrderStatusForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "action": {
              "anyOf": [
                {
                  "const": "send"
                },
                {
                  "const": "cancel"
                },
                {
                  "const": "close"
                }
              ]
            }
          },
          "required": [
            "id",
            "action"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-recordStockInwardForActor",
    "route": "POST /api/v1/ui/commands/recordStockInwardForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "item_id": {
            "type": "number"
          },
          "qty": {
            "type": "number"
          },
          "note": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "purchase_order_line_id": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [
          "item_id",
          "qty"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-reviseInwardPurchaseForActor",
    "route": "POST /api/v1/ui/commands/reviseInwardPurchaseForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "purchaseId": {
              "type": "number"
            },
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "purchaseId",
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "reason": {
            "type": "string"
          },
          "lines": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D2"
            }
          }
        },
        "required": [
          "reason",
          "lines"
        ],
        "additionalProperties": false
      },
      "D2": {
        "type": "object",
        "properties": {
          "purchase_order_line_id": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "number"
              }
            ]
          },
          "item_id": {
            "type": "number"
          },
          "received_qty": {
            "type": "number"
          },
          "unit_cost": {
            "type": "number"
          },
          "discount": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "gst_rate": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [
          "item_id",
          "received_qty",
          "unit_cost"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-issueMaterialQty",
    "route": "POST /api/v1/ui/commands/issueMaterialQty",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "requestId": {
              "type": "number"
            },
            "qty": {
              "type": "number"
            }
          },
          "required": [
            "requestId",
            "qty"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-reconcileMaterialQty",
    "route": "POST /api/v1/ui/commands/reconcileMaterialQty",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "requestId": {
              "type": "number"
            },
            "used": {
              "type": "number"
            },
            "returned": {
              "type": "number"
            },
            "wasted": {
              "type": "number"
            }
          },
          "required": [
            "requestId",
            "used",
            "returned",
            "wasted"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-submitMaterialApprovalForActor",
    "route": "POST /api/v1/ui/commands/submitMaterialApprovalForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "rowId": {
              "type": "number"
            }
          },
          "required": [
            "rowId"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-decideMaterialApprovalForActor",
    "route": "POST /api/v1/ui/commands/decideMaterialApprovalForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "jobId": {
              "type": "number"
            },
            "decision": {
              "anyOf": [
                {
                  "const": "Approved"
                },
                {
                  "const": "Rejected"
                }
              ]
            },
            "rejectionReason": {
              "type": "string"
            }
          },
          "required": [
            "jobId",
            "decision"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-resubmitMaterialApprovalForActor",
    "route": "POST /api/v1/ui/commands/resubmitMaterialApprovalForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "jobId": {
              "type": "number"
            }
          },
          "required": [
            "jobId"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-addMaterialRowForActor",
    "route": "POST /api/v1/ui/commands/addMaterialRowForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "jobId": {
              "type": "number"
            },
            "itemId": {
              "type": "number"
            },
            "qty": {
              "type": "number"
            }
          },
          "required": [
            "jobId",
            "itemId",
            "qty"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-updateMaterialRowForActor",
    "route": "POST /api/v1/ui/commands/updateMaterialRowForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "rowId": {
              "type": "number"
            },
            "itemId": {
              "type": "number"
            },
            "qty": {
              "type": "number"
            }
          },
          "required": [
            "rowId",
            "itemId",
            "qty"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-deleteMaterialRowForActor",
    "route": "POST /api/v1/ui/commands/deleteMaterialRowForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "rowId": {
              "type": "number"
            }
          },
          "required": [
            "rowId"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-requestMaterialRowForActor",
    "route": "POST /api/v1/ui/commands/requestMaterialRowForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "rowId": {
              "type": "number"
            }
          },
          "required": [
            "rowId"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "$ref": "#/$defs/D1"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "onHand": {
            "type": "number"
          },
          "warning": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "onHand",
          "warning"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-reRequestMaterialRowForActor",
    "route": "POST /api/v1/ui/commands/reRequestMaterialRowForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "rowId": {
              "type": "number"
            },
            "itemId": {
              "type": "number"
            },
            "qty": {
              "type": "number"
            }
          },
          "required": [
            "rowId",
            "itemId",
            "qty"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "$ref": "#/$defs/D1"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "onHand": {
            "type": "number"
          },
          "warning": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "onHand",
          "warning"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-releaseMaterialRowForActor",
    "route": "POST /api/v1/ui/commands/releaseMaterialRowForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "rowId": {
              "type": "number"
            }
          },
          "required": [
            "rowId"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-editIssuedMaterialRowForActor",
    "route": "POST /api/v1/ui/commands/editIssuedMaterialRowForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "rowId": {
              "type": "number"
            },
            "itemId": {
              "type": "number"
            },
            "qty": {
              "type": "number"
            },
            "note": {
              "type": "string"
            }
          },
          "required": [
            "rowId",
            "itemId",
            "qty",
            "note"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-cancelMaterialRowForActor",
    "route": "POST /api/v1/ui/commands/cancelMaterialRowForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "rowId": {
              "type": "number"
            }
          },
          "required": [
            "rowId"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-createInventoryItem",
    "route": "POST /api/v1/ui/commands/createInventoryItem",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "payload": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "payload"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "archived_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "archived_reason": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "created_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "updated_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "unit": {
            "type": "string"
          },
          "sku": {
            "type": "string"
          },
          "category": {
            "type": "string"
          },
          "stock_qty": {
            "type": "number"
          },
          "low_stock_qty": {
            "type": "number"
          },
          "selling_price": {
            "type": "number"
          }
        },
        "required": [
          "name",
          "unit",
          "sku",
          "category",
          "stock_qty",
          "low_stock_qty",
          "selling_price"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-updateInventoryItem",
    "route": "POST /api/v1/ui/commands/updateInventoryItem",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "payload": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "id",
            "payload"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "archived_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "archived_reason": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "created_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "updated_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "unit": {
            "type": "string"
          },
          "sku": {
            "type": "string"
          },
          "category": {
            "type": "string"
          },
          "stock_qty": {
            "type": "number"
          },
          "low_stock_qty": {
            "type": "number"
          },
          "selling_price": {
            "type": "number"
          }
        },
        "required": [
          "name",
          "unit",
          "sku",
          "category",
          "stock_qty",
          "low_stock_qty",
          "selling_price"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-archiveInventoryItem",
    "route": "POST /api/v1/ui/commands/archiveInventoryItem",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "reason": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "reason"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-stockIn",
    "route": "POST /api/v1/ui/commands/stockIn",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "itemId": {
              "type": "number"
            },
            "qty": {
              "type": "number"
            },
            "note": {
              "type": "string"
            }
          },
          "required": [
            "itemId",
            "qty",
            "note"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-adjustStock",
    "route": "POST /api/v1/ui/commands/adjustStock",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "itemId": {
              "type": "number"
            },
            "qty": {
              "type": "number"
            },
            "note": {
              "type": "string"
            }
          },
          "required": [
            "itemId",
            "qty",
            "note"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-createTask",
    "route": "POST /api/v1/ui/commands/createTask",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "payload": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "payload"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "archived_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "archived_reason": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "created_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "updated_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "technician_id": {
            "type": "number"
          },
          "status": {
            "anyOf": [
              {
                "const": "Pending"
              },
              {
                "const": "Started"
              },
              {
                "const": "Paused"
              },
              {
                "const": "Completed"
              }
            ]
          },
          "job_card_id": {
            "type": "number"
          },
          "title": {
            "type": "string"
          },
          "notes": {
            "type": "string"
          },
          "started_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "paused_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "completed_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "technician_id",
          "status",
          "job_card_id",
          "title",
          "notes"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-updateTask",
    "route": "POST /api/v1/ui/commands/updateTask",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "taskId": {
              "type": "number"
            },
            "status": {
              "anyOf": [
                {
                  "const": "Pending"
                },
                {
                  "const": "Started"
                },
                {
                  "const": "Paused"
                },
                {
                  "const": "Completed"
                }
              ]
            },
            "notes": {
              "type": "string"
            }
          },
          "required": [
            "taskId",
            "status",
            "notes"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-archiveTask",
    "route": "POST /api/v1/ui/commands/archiveTask",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "reason": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "reason"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-markWashingNeeded",
    "route": "POST /api/v1/ui/commands/markWashingNeeded",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "jobId": {
              "type": "number"
            }
          },
          "required": [
            "jobId"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-updateQcCheck",
    "route": "POST /api/v1/ui/commands/updateQcCheck",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "passed": {
              "anyOf": [
                {
                  "const": false
                },
                {
                  "const": true
                }
              ]
            },
            "failReason": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "passed"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-failQcWithRework",
    "route": "POST /api/v1/ui/commands/failQcWithRework",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "checkId": {
              "type": "number"
            },
            "technicianId": {
              "type": "number"
            },
            "reason": {
              "type": "string"
            }
          },
          "required": [
            "checkId",
            "technicianId",
            "reason"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-passQc",
    "route": "POST /api/v1/ui/commands/passQc",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "jobId": {
              "type": "number"
            }
          },
          "required": [
            "jobId"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-createInvoiceItem",
    "route": "POST /api/v1/ui/commands/createInvoiceItem",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "invoiceId": {
              "type": "number"
            },
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "invoiceId",
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "kind": {
            "anyOf": [
              {
                "const": "Service"
              },
              {
                "const": "Material"
              }
            ]
          },
          "description": {
            "type": "string"
          },
          "qty": {
            "type": "number"
          },
          "rate": {
            "type": "number"
          },
          "gst_type": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "const": "CGST+SGST"
              },
              {
                "const": "IGST"
              },
              {
                "const": "No GST"
              }
            ]
          },
          "gst_rate": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "number"
              }
            ]
          },
          "material_row_id": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [
          "kind",
          "description",
          "qty",
          "rate"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-updateInvoiceItem",
    "route": "POST /api/v1/ui/commands/updateInvoiceItem",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "itemId": {
              "type": "number"
            },
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "itemId",
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "kind": {
            "anyOf": [
              {
                "const": "Service"
              },
              {
                "const": "Material"
              }
            ]
          },
          "description": {
            "type": "string"
          },
          "qty": {
            "type": "number"
          },
          "rate": {
            "type": "number"
          },
          "gst_type": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "const": "CGST+SGST"
              },
              {
                "const": "IGST"
              },
              {
                "const": "No GST"
              }
            ]
          },
          "gst_rate": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "number"
              }
            ]
          },
          "material_row_id": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [
          "kind",
          "description",
          "qty",
          "rate"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-archiveInvoiceItem",
    "route": "POST /api/v1/ui/commands/archiveInvoiceItem",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "itemId": {
              "type": "number"
            },
            "reason": {
              "type": "string"
            }
          },
          "required": [
            "itemId",
            "reason"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-createInvoiceForActor",
    "route": "POST /api/v1/ui/commands/createInvoiceForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "jobId": {
              "type": "number"
            },
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "jobId",
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "tallyInvoiceNo": {
            "type": "string"
          },
          "discount": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "gstRate": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "items": {
            "anyOf": [
              {
                "type": "array",
                "items": {
                  "$ref": "#/$defs/D2"
                }
              }
            ]
          },
          "notes": {
            "type": "string"
          }
        },
        "required": [
          "tallyInvoiceNo",
          "notes"
        ],
        "additionalProperties": false
      },
      "D2": {
        "type": "object",
        "properties": {
          "kind": {
            "anyOf": [
              {
                "const": "Service"
              },
              {
                "const": "Material"
              }
            ]
          },
          "description": {
            "type": "string"
          },
          "qty": {
            "type": "number"
          },
          "rate": {
            "type": "number"
          },
          "gst_type": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "const": "CGST+SGST"
              },
              {
                "const": "IGST"
              },
              {
                "const": "No GST"
              }
            ]
          },
          "gst_rate": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "number"
              }
            ]
          },
          "material_row_id": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [
          "kind",
          "description",
          "qty",
          "rate"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-updateInvoiceForActor",
    "route": "POST /api/v1/ui/commands/updateInvoiceForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "invoiceId": {
              "type": "number"
            },
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "invoiceId",
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "tallyInvoiceNo": {
            "type": "string"
          },
          "discount": {
            "type": "number"
          },
          "notes": {
            "type": "string"
          }
        },
        "required": [
          "tallyInvoiceNo",
          "discount",
          "notes"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-saveInvoiceForActor",
    "route": "POST /api/v1/ui/commands/saveInvoiceForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "invoiceId": {
              "type": "number"
            },
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "invoiceId",
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "items": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D2"
            }
          },
          "note": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "tallyInvoiceNo": {
            "type": "string"
          },
          "discount": {
            "type": "number"
          },
          "notes": {
            "type": "string"
          }
        },
        "required": [
          "items",
          "tallyInvoiceNo",
          "discount",
          "notes"
        ],
        "additionalProperties": false
      },
      "D2": {
        "type": "object",
        "properties": {
          "kind": {
            "anyOf": [
              {
                "const": "Service"
              },
              {
                "const": "Material"
              }
            ]
          },
          "description": {
            "type": "string"
          },
          "qty": {
            "type": "number"
          },
          "rate": {
            "type": "number"
          },
          "gst_type": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "const": "CGST+SGST"
              },
              {
                "const": "IGST"
              },
              {
                "const": "No GST"
              }
            ]
          },
          "gst_rate": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "number"
              }
            ]
          },
          "material_row_id": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "id": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [
          "kind",
          "description",
          "qty",
          "rate"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-voidInvoiceForActor",
    "route": "POST /api/v1/ui/commands/voidInvoiceForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "invoiceId": {
              "type": "number"
            },
            "reason": {
              "type": "string"
            }
          },
          "required": [
            "invoiceId",
            "reason"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-recordPaymentForActor",
    "route": "POST /api/v1/ui/commands/recordPaymentForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "invoiceId": {
              "type": "number"
            },
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "invoiceId",
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "mode": {
            "anyOf": [
              {
                "const": "Other"
              },
              {
                "const": "UPI"
              },
              {
                "const": "Cash"
              },
              {
                "const": "Card"
              },
              {
                "const": "Bank transfer"
              }
            ]
          },
          "otherDetail": {
            "type": "string"
          },
          "reference": {
            "type": "string"
          },
          "notes": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "mode",
          "otherDetail",
          "reference"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-voidPaymentForActor",
    "route": "POST /api/v1/ui/commands/voidPaymentForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "reason": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "reason"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-updateDeliveryForActor",
    "route": "POST /api/v1/ui/commands/updateDeliveryForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "jobId": {
              "type": "number"
            },
            "deliveredBy": {
              "type": "string"
            },
            "finalKm": {
              "type": "number"
            },
            "acknowledgement": {
              "type": "string"
            }
          },
          "required": [
            "jobId",
            "deliveredBy",
            "finalKm",
            "acknowledgement"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-markJobDeliveredForActor",
    "route": "POST /api/v1/ui/commands/markJobDeliveredForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "jobId": {
              "type": "number"
            },
            "deliveredBy": {
              "type": "string"
            },
            "finalKm": {
              "type": "number"
            },
            "acknowledgement": {
              "type": "string"
            },
            "timestamp": {
              "type": "string"
            }
          },
          "required": [
            "jobId",
            "deliveredBy",
            "finalKm",
            "acknowledgement"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-createFollowup",
    "route": "POST /api/v1/ui/commands/createFollowup",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "payload": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "payload"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "archived_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "archived_reason": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "created_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "updated_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "done": {
            "type": "number"
          },
          "job_card_id": {
            "type": "number"
          },
          "note": {
            "type": "string"
          },
          "due_at": {
            "type": "string"
          },
          "outcome": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "done",
          "job_card_id",
          "note",
          "due_at"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-createResolvedFollowup",
    "route": "POST /api/v1/ui/commands/createResolvedFollowup",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "payload": {
              "$ref": "#/$defs/D1"
            },
            "timestamp": {
              "type": "string"
            }
          },
          "required": [
            "payload"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "archived_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "archived_reason": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "created_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "updated_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "done": {
            "type": "number"
          },
          "job_card_id": {
            "type": "number"
          },
          "note": {
            "type": "string"
          },
          "due_at": {
            "type": "string"
          },
          "outcome": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "done",
          "job_card_id",
          "note",
          "due_at"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-updateFollowup",
    "route": "POST /api/v1/ui/commands/updateFollowup",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "payload": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "id",
            "payload"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "archived_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "archived_reason": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "created_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "updated_at": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "done": {
            "type": "number"
          },
          "job_card_id": {
            "type": "number"
          },
          "note": {
            "type": "string"
          },
          "due_at": {
            "type": "string"
          },
          "outcome": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "done",
          "job_card_id",
          "note",
          "due_at"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-archiveFollowup",
    "route": "POST /api/v1/ui/commands/archiveFollowup",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "reason": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "reason"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-markFollowupDone",
    "route": "POST /api/v1/ui/commands/markFollowupDone",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "outcome": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "outcome"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-saveJobPhotoForActor",
    "route": "POST /api/v1/ui/commands/saveJobPhotoForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "jobId": {
              "type": "number"
            },
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "jobId",
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "label": {
            "type": "string"
          },
          "category": {
            "anyOf": [
              {
                "const": "Before Work"
              },
              {
                "const": "After Work"
              }
            ]
          },
          "src": {
            "type": "string"
          },
          "originalName": {
            "type": "string"
          },
          "width": {
            "type": "number"
          },
          "height": {
            "type": "number"
          }
        },
        "required": [
          "label",
          "category",
          "src",
          "originalName",
          "width",
          "height"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-updateJobPhotoForActor",
    "route": "POST /api/v1/ui/commands/updateJobPhotoForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "id",
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "category": {
            "anyOf": [
              {
                "const": "Before Work"
              },
              {
                "const": "After Work"
              }
            ]
          },
          "label": {
            "type": "string"
          }
        },
        "required": [
          "category",
          "label"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-archiveJobPhotoForActor",
    "route": "POST /api/v1/ui/commands/archiveJobPhotoForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "reason": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "reason"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-setChecklistItemCheckedForActor",
    "route": "POST /api/v1/ui/commands/setChecklistItemCheckedForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "itemId": {
              "type": "number"
            },
            "checked": {
              "anyOf": [
                {
                  "const": false
                },
                {
                  "const": true
                }
              ]
            },
            "timestamp": {
              "type": "string"
            },
            "payment": {
              "anyOf": [
                {
                  "$ref": "#/$defs/D1"
                }
              ]
            }
          },
          "required": [
            "itemId",
            "checked"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "mode": {
            "anyOf": [
              {
                "const": "Other"
              },
              {
                "const": "UPI"
              },
              {
                "const": "Cash"
              },
              {
                "const": "Card"
              },
              {
                "const": "Bank transfer"
              }
            ]
          },
          "otherDetail": {
            "type": "string"
          },
          "reference": {
            "type": "string"
          },
          "notes": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "mode",
          "otherDetail",
          "reference"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-setChecklistItemNotApplicableForActor",
    "route": "POST /api/v1/ui/commands/setChecklistItemNotApplicableForActor",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "itemId": {
              "type": "number"
            },
            "notApplicable": {
              "anyOf": [
                {
                  "const": false
                },
                {
                  "const": true
                }
              ]
            },
            "timestamp": {
              "type": "string"
            }
          },
          "required": [
            "itemId",
            "notApplicable"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-createSalesLead",
    "route": "POST /api/v1/ui/commands/createSalesLead",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "email": {
            "type": "string"
          },
          "phone": {
            "type": "string"
          },
          "address": {
            "type": "string"
          },
          "notes": {
            "type": "string"
          },
          "display_name": {
            "type": "string"
          },
          "company": {
            "type": "string"
          },
          "service_interest": {
            "type": "string"
          },
          "stage": {
            "anyOf": [
              {
                "const": "NEW"
              },
              {
                "const": "QUALIFIED"
              },
              {
                "const": "QUOTATION_SENT"
              },
              {
                "const": "WON"
              },
              {
                "const": "LOST"
              }
            ]
          },
          "temperature": {
            "anyOf": [
              {
                "const": "HOT"
              },
              {
                "const": "WARM"
              },
              {
                "const": "COLD"
              }
            ]
          },
          "follow_up_due": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          },
          "site_visit_date": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          },
          "company_not_entered": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "email_not_entered": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "site_visit_completed": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [
          "email",
          "phone",
          "address",
          "notes",
          "display_name",
          "company",
          "service_interest",
          "stage",
          "temperature",
          "follow_up_due",
          "site_visit_date"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-updateSalesLead",
    "route": "POST /api/v1/ui/commands/updateSalesLead",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "leadId": {
              "type": "number"
            },
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "leadId",
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "email": {
            "type": "string"
          },
          "phone": {
            "type": "string"
          },
          "address": {
            "type": "string"
          },
          "notes": {
            "type": "string"
          },
          "display_name": {
            "type": "string"
          },
          "company": {
            "type": "string"
          },
          "service_interest": {
            "type": "string"
          },
          "stage": {
            "anyOf": [
              {
                "const": "NEW"
              },
              {
                "const": "QUALIFIED"
              },
              {
                "const": "QUOTATION_SENT"
              },
              {
                "const": "WON"
              },
              {
                "const": "LOST"
              }
            ]
          },
          "temperature": {
            "anyOf": [
              {
                "const": "HOT"
              },
              {
                "const": "WARM"
              },
              {
                "const": "COLD"
              }
            ]
          },
          "follow_up_due": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          },
          "site_visit_date": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          },
          "company_not_entered": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "email_not_entered": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "site_visit_completed": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          }
        },
        "required": [
          "email",
          "phone",
          "address",
          "notes",
          "display_name",
          "company",
          "service_interest",
          "stage",
          "temperature",
          "follow_up_due",
          "site_visit_date"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-createSalesQuotation",
    "route": "POST /api/v1/ui/commands/createSalesQuotation",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "lead_id": {
            "type": "number"
          },
          "valid_until": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          },
          "customer_notes": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "discount": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "template_id": {
            "type": "string"
          },
          "template_html": {
            "type": "string"
          },
          "lines": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D2"
            }
          }
        },
        "required": [
          "lead_id",
          "template_id",
          "template_html",
          "lines"
        ],
        "additionalProperties": false
      },
      "D2": {
        "type": "object",
        "properties": {
          "kind": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "rate": {
            "type": "number"
          },
          "gst_rate": {
            "type": "number"
          },
          "quantity": {
            "type": "number"
          }
        },
        "required": [
          "kind",
          "description",
          "rate",
          "gst_rate",
          "quantity"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-updateSalesQuotation",
    "route": "POST /api/v1/ui/commands/updateSalesQuotation",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "quotationId": {
              "type": "number"
            },
            "input": {
              "$ref": "#/$defs/D1"
            }
          },
          "required": [
            "quotationId",
            "input"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {
      "D1": {
        "type": "object",
        "properties": {
          "lead_id": {
            "type": "number"
          },
          "valid_until": {
            "anyOf": [
              {
                "type": "null"
              },
              {
                "type": "string"
              }
            ]
          },
          "customer_notes": {
            "anyOf": [
              {
                "type": "string"
              }
            ]
          },
          "discount": {
            "anyOf": [
              {
                "type": "number"
              }
            ]
          },
          "template_id": {
            "type": "string"
          },
          "template_html": {
            "type": "string"
          },
          "lines": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/D2"
            }
          }
        },
        "required": [
          "lead_id",
          "template_id",
          "template_html",
          "lines"
        ],
        "additionalProperties": false
      },
      "D2": {
        "type": "object",
        "properties": {
          "kind": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "rate": {
            "type": "number"
          },
          "gst_rate": {
            "type": "number"
          },
          "quantity": {
            "type": "number"
          }
        },
        "required": [
          "kind",
          "description",
          "rate",
          "gst_rate",
          "quantity"
        ],
        "additionalProperties": false
      }
    },
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-setSalesQuotationStatus",
    "route": "POST /api/v1/ui/commands/setSalesQuotationStatus",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "quotationId": {
              "type": "number"
            },
            "status": {
              "anyOf": [
                {
                  "const": "DRAFT"
                },
                {
                  "const": "SENT"
                },
                {
                  "const": "ACCEPTED"
                },
                {
                  "const": "REJECTED"
                },
                {
                  "const": "EXPIRED"
                }
              ]
            }
          },
          "required": [
            "quotationId",
            "status"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-createServiceDepartment",
    "route": "POST /api/v1/ui/commands/createServiceDepartment",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            }
          },
          "required": [
            "name"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-updateServiceDepartment",
    "route": "POST /api/v1/ui/commands/updateServiceDepartment",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "departmentId": {
              "type": "number"
            },
            "name": {
              "type": "string"
            },
            "status": {
              "anyOf": [
                {
                  "const": "ACTIVE"
                },
                {
                  "const": "ARCHIVED"
                }
              ]
            }
          },
          "required": [
            "departmentId",
            "name",
            "status"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-createServiceCatalogMaster",
    "route": "POST /api/v1/ui/commands/createServiceCatalogMaster",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "table": {
              "anyOf": [
                {
                  "const": "service_brands"
                },
                {
                  "const": "car_segments"
                }
              ]
            },
            "name": {
              "type": "string"
            }
          },
          "required": [
            "table",
            "name"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "number"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-updateServiceCatalogMaster",
    "route": "POST /api/v1/ui/commands/updateServiceCatalogMaster",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "table": {
              "anyOf": [
                {
                  "const": "service_brands"
                },
                {
                  "const": "car_segments"
                }
              ]
            },
            "id": {
              "type": "number"
            },
            "name": {
              "type": "string"
            },
            "status": {
              "anyOf": [
                {
                  "const": "ACTIVE"
                },
                {
                  "const": "ARCHIVED"
                }
              ]
            }
          },
          "required": [
            "table",
            "id",
            "name",
            "status"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-appointServiceDepartmentManager",
    "route": "POST /api/v1/ui/commands/appointServiceDepartmentManager",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "departmentId": {
              "type": "number"
            },
            "managerId": {
              "type": "number"
            }
          },
          "required": [
            "departmentId",
            "managerId"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-removeServiceDepartmentManager",
    "route": "POST /api/v1/ui/commands/removeServiceDepartmentManager",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "departmentId": {
              "type": "number"
            },
            "managerId": {
              "type": "number"
            }
          },
          "required": [
            "departmentId",
            "managerId"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-assignServiceAdvisorTeam",
    "route": "POST /api/v1/ui/commands/assignServiceAdvisorTeam",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "departmentId": {
              "type": "number"
            },
            "managerId": {
              "type": "number"
            },
            "advisorId": {
              "type": "number"
            }
          },
          "required": [
            "departmentId",
            "managerId",
            "advisorId"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  },
  {
    "operation": "OP-db-removeServiceAdvisorTeam",
    "route": "POST /api/v1/ui/commands/removeServiceAdvisorTeam",
    "description": "Design structural schema. Compose with source validators, authorization, versions/idempotency and decimal wire rules in 25. Not installed.",
    "request": {
      "type": "object",
      "properties": {
        "input": {
          "type": "object",
          "properties": {
            "departmentId": {
              "type": "number"
            },
            "managerId": {
              "type": "number"
            },
            "advisorId": {
              "type": "number"
            }
          },
          "required": [
            "departmentId",
            "managerId",
            "advisorId"
          ],
          "additionalProperties": false
        },
        "expectedVersions": {
          "type": "object",
          "additionalProperties": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "required": [
        "input",
        "expectedVersions"
      ],
      "additionalProperties": false
    },
    "result": {
      "type": "null"
    },
    "$defs": {},
    "unverifiedTypes": []
  }
]