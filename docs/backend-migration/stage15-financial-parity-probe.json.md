{
  "local": {
    "lines": [
      {
        "amount": 100,
        "discount": 50,
        "taxable": 50,
        "gst": 9,
        "total": 59
      },
      {
        "amount": 100,
        "discount": 50,
        "taxable": 50,
        "gst": 0,
        "total": 50
      }
    ],
    "subtotal": 200,
    "discount": 100,
    "taxable": 100,
    "gst": 9,
    "total": 109
  },
  "checkout_backend": [
    {
      "description": "A",
      "quantity": 1.0,
      "unitAmountPaise": 10000,
      "gstRateBps": 1800,
      "discountPaise": 10000,
      "taxablePaise": 0,
      "taxPaise": 0,
      "cgstPaise": 0,
      "sgstPaise": 0,
      "igstPaise": 0,
      "totalPaise": 0
    },
    {
      "description": "B",
      "quantity": 1.0,
      "unitAmountPaise": 10000,
      "gstRateBps": 0,
      "discountPaise": 0,
      "taxablePaise": 10000,
      "taxPaise": 0,
      "cgstPaise": 0,
      "sgstPaise": 0,
      "igstPaise": 0,
      "totalPaise": 10000
    }
  ],
  "backend_total_rupees": 100.0,
  "method": "Existing local pure function imported; exact AST-extracted backend pure function evaluated without importing backend application or connecting to any database."
}
