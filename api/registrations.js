import { google } from "googleapis";
import { parseRegistrationPayload } from "../src/lib/registrationSchema.js";

const REQUIRED_ENV_VARS = [
  "GOOGLE_SERVICE_ACCOUNT_EMAIL",
  "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY",
  "GOOGLE_SHEETS_SPREADSHEET_ID",
];

function getMissingEnvVars() {
  return REQUIRED_ENV_VARS.filter((name) => !process.env[name]);
}

function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

function buildRow(payload) {
  return [
    new Date().toISOString(),
    payload.name,
    payload.surname,
    payload.email,
    payload.phone,
    payload.company,
    payload.participationType,
  ];
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const missingEnvVars = getMissingEnvVars();
  if (missingEnvVars.length > 0) {
    return res.status(500).json({
      error: "Google Sheets integration is not configured",
      missingEnvVars,
    });
  }

  try {
    const payload = parseRegistrationPayload(req.body ?? {});
    const sheets = getSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || "Registrations";
    const range = `${sheetName}!A:G`;

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [buildRow(payload)],
      },
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    if (error?.name === "ZodError") {
      return res.status(400).json({
        error: "Validation failed",
        issues: error.issues,
      });
    }

    console.error("Google Sheets append error:", error);

    return res.status(500).json({
      error: "Failed to save registration",
    });
  }
}
