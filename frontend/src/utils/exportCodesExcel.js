import FileSaver from "file-saver";
import { roleLabel } from "./codesUtils.js";

const { saveAs } = FileSaver;

const COLORS = {
  navy: "FF1F4E78",
  blue: "FF2B5A9E",
  lightBlue: "FFDCE6F1",
  text: "FF243247",
  muted: "FF64748B",
  border: "FFD9E2EC",
  stripe: "FFF7FAFC",
  white: "FFFFFFFF",
  usedFill: "FFDCFCE7",
  usedText: "FF166534",
  unusedFill: "FFFEF3C7",
  unusedText: "FF92400E",
  teacherFill: "FFEDE9FE",
  teacherText: "FF6D28D9",
  studentFill: "FFDBEAFE",
  studentText: "FF1D4ED8",
};

const FONT_NAME = "Arial";
const HEADERS = [
  "Book Name",
  "Code",
  "Validity (Months)",
  "Role",
  "Status",
  "Created Date",
  "Used Date",
];

function toDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function solidFill(color) {
  return { type: "pattern", pattern: "solid", fgColor: { argb: color } };
}

function safeSheetName(value) {
  return String(value || "Codes")
    .replace(/[\\/*?:[\]]/g, " ")
    .trim()
    .slice(0, 31) || "Codes";
}

export async function buildCodesWorkbook(
  codes,
  {
    title = "Book Activation Codes Report",
    sheetName = "Codes",
  } = {},
) {
  const { default: ExcelJS } = await import("exceljs");
  const normalizedCodes = codes || [];
  const usedCount = normalizedCodes.filter((code) => code.is_used).length;
  const unusedCount = normalizedCodes.length - usedCount;
  const exportedAt = new Date();

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Book Platform";
  workbook.created = exportedAt;
  workbook.modified = exportedAt;
  workbook.subject = "Book activation codes";
  workbook.title = title;

  const worksheet = workbook.addWorksheet(safeSheetName(sheetName), {
    properties: { defaultRowHeight: 21 },
    views: [
      {
        state: "frozen",
        ySplit: 4,
        activeCell: "A5",
        showGridLines: false,
      },
    ],
    pageSetup: {
      orientation: "landscape",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: {
        left: 0.25,
        right: 0.25,
        top: 0.5,
        bottom: 0.5,
        header: 0.2,
        footer: 0.2,
      },
    },
  });

  worksheet.columns = [
    { width: 30 },
    { width: 20 },
    { width: 19 },
    { width: 14 },
    { width: 13 },
    { width: 16 },
    { width: 16 },
  ];

  worksheet.mergeCells("A1:G1");
  worksheet.getCell("A1").value = title;
  worksheet.getCell("A1").fill = solidFill(COLORS.navy);
  worksheet.getCell("A1").font = {
    name: FONT_NAME,
    size: 16,
    bold: true,
    color: { argb: COLORS.white },
  };
  worksheet.getCell("A1").alignment = {
    horizontal: "left",
    vertical: "middle",
  };
  worksheet.getRow(1).height = 28;

  worksheet.mergeCells("A2:G2");
  worksheet.getCell("A2").value =
    `Exported: ${exportedAt.toLocaleDateString("en-GB")}    ` +
    `Total: ${normalizedCodes.length}    Used: ${usedCount}    ` +
    `Unused: ${unusedCount}`;
  worksheet.getCell("A2").fill = solidFill(COLORS.lightBlue);
  worksheet.getCell("A2").font = {
    name: FONT_NAME,
    size: 10,
    italic: true,
    color: { argb: COLORS.muted },
  };
  worksheet.getCell("A2").alignment = {
    horizontal: "left",
    vertical: "middle",
  };
  worksheet.getRow(2).height = 22;
  worksheet.getRow(3).height = 8;

  const headerRow = worksheet.getRow(4);
  headerRow.values = HEADERS;
  headerRow.height = 25;
  headerRow.eachCell((cell) => {
    cell.fill = solidFill(COLORS.blue);
    cell.font = {
      name: FONT_NAME,
      size: 10,
      bold: true,
      color: { argb: COLORS.white },
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      right: { style: "thin", color: { argb: COLORS.white } },
      bottom: { style: "thin", color: { argb: COLORS.navy } },
    };
  });

  normalizedCodes.forEach((code, index) => {
    const row = worksheet.addRow([
      code.book_title || "—",
      code.code || "",
      Number(code.validity_months) || 0,
      roleLabel(code.allowed_role),
      code.is_used ? "Used" : "Unused",
      toDate(code.created_at),
      toDate(code.used_at),
    ]);
    const background = index % 2 === 1 ? COLORS.stripe : COLORS.white;

    row.height = 21;
    row.eachCell({ includeEmpty: true }, (cell, columnNumber) => {
      cell.fill = solidFill(background);
      cell.font = {
        name: FONT_NAME,
        size: 10,
        color: { argb: COLORS.text },
        bold: columnNumber === 2,
      };
      cell.alignment = {
        horizontal: columnNumber === 3 ? "center" : "left",
        vertical: "middle",
      };
      cell.border = {
        bottom: { style: "thin", color: { argb: COLORS.border } },
      };
    });

    row.getCell(2).numFmt = "@";
    row.getCell(3).numFmt = "0";
    row.getCell(6).numFmt = "dd/mm/yyyy";
    row.getCell(7).numFmt = "dd/mm/yyyy";

    const roleCell = row.getCell(4);
    const isTeacher = roleCell.value === "Teacher";
    roleCell.fill = solidFill(
      isTeacher ? COLORS.teacherFill : COLORS.studentFill,
    );
    roleCell.font = {
      ...roleCell.font,
      bold: true,
      color: {
        argb: isTeacher ? COLORS.teacherText : COLORS.studentText,
      },
    };
    roleCell.alignment = { horizontal: "center", vertical: "middle" };

    const statusCell = row.getCell(5);
    const isUsed = statusCell.value === "Used";
    statusCell.fill = solidFill(
      isUsed ? COLORS.usedFill : COLORS.unusedFill,
    );
    statusCell.font = {
      ...statusCell.font,
      bold: true,
      color: { argb: isUsed ? COLORS.usedText : COLORS.unusedText },
    };
    statusCell.alignment = { horizontal: "center", vertical: "middle" };
  });

  const lastRow = Math.max(4, worksheet.rowCount);
  worksheet.autoFilter = {
    from: { row: 4, column: 1 },
    to: { row: lastRow, column: HEADERS.length },
  };
  worksheet.pageSetup.printTitlesRow = "1:4";

  return workbook;
}

export async function exportCodesExcel(codes, options = {}) {
  const workbook = await buildCodesWorkbook(codes, options);
  const buffer = await workbook.xlsx.writeBuffer();
  const dateStamp = new Date().toISOString().slice(0, 10);
  const fileName = options.fileName || `book-codes-${dateStamp}.xlsx`;

  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    fileName,
  );
}
