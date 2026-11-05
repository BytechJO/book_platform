import FileSaver from "file-saver";

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
  publishedFill: "FFDCFCE7",
  publishedText: "FF166534",
  draftFill: "FFFEF3C7",
  draftText: "FF92400E",
  englishFill: "FFDBEAFE",
  englishText: "FF1D4ED8",
  arabicFill: "FFDCFCE7",
  arabicText: "FF166534",
  frenchFill: "FFFFEDD5",
  frenchText: "FFC2410C",
  neutralFill: "FFF1F5F9",
  neutralText: "FF475569",
};

const FONT_NAME = "Arial";
const HEADERS = [
  "Title",
  "ISBN",
  "Author",
  "Category",
  "Language",
  "Status",
  "Published On",
  "Views",
];

function toDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function label(value) {
  if (!value) return "—";
  const normalized = String(value).trim();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
}

function solidFill(color) {
  return { type: "pattern", pattern: "solid", fgColor: { argb: color } };
}

function getLanguageColors(language) {
  const normalized = String(language || "").toLowerCase();

  if (normalized === "english") {
    return [COLORS.englishFill, COLORS.englishText];
  }
  if (normalized === "arabic") {
    return [COLORS.arabicFill, COLORS.arabicText];
  }
  if (normalized === "french") {
    return [COLORS.frenchFill, COLORS.frenchText];
  }
  return [COLORS.neutralFill, COLORS.neutralText];
}

export async function buildBooksWorkbook(books) {
  const { default: ExcelJS } = await import("exceljs");
  const normalizedBooks = books || [];
  const publishedCount = normalizedBooks.filter(
    (book) => String(book.status).toLowerCase() === "published",
  ).length;
  const draftCount = normalizedBooks.filter(
    (book) => String(book.status).toLowerCase() === "draft",
  ).length;
  const totalViews = normalizedBooks.reduce(
    (sum, book) => sum + (Number(book.views) || 0),
    0,
  );
  const exportedAt = new Date();

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Book Platform";
  workbook.created = exportedAt;
  workbook.modified = exportedAt;
  workbook.subject = "Books catalog";
  workbook.title = "Books Report";

  const worksheet = workbook.addWorksheet("Books", {
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
    { width: 32 },
    { width: 19 },
    { width: 23 },
    { width: 20 },
    { width: 14 },
    { width: 14 },
    { width: 17 },
    { width: 12 },
  ];

  worksheet.mergeCells("A1:H1");
  worksheet.getCell("A1").value = "Books Report";
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

  worksheet.mergeCells("A2:H2");
  worksheet.getCell("A2").value =
    `Exported: ${exportedAt.toLocaleDateString("en-GB")}    ` +
    `Total: ${normalizedBooks.length}    Published: ${publishedCount}    ` +
    `Drafts: ${draftCount}    Views: ${totalViews.toLocaleString("en-US")}`;
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

  normalizedBooks.forEach((book, index) => {
    const row = worksheet.addRow([
      book.title || "—",
      book.isbn || "",
      book.created_by_name || "—",
      book.category_name || "—",
      label(book.language),
      label(book.status),
      toDate(book.published_at),
      Number(book.views) || 0,
    ]);
    const background = index % 2 === 1 ? COLORS.stripe : COLORS.white;

    row.height = 21;
    row.eachCell({ includeEmpty: true }, (cell, columnNumber) => {
      cell.fill = solidFill(background);
      cell.font = {
        name: FONT_NAME,
        size: 10,
        color: { argb: COLORS.text },
        bold: columnNumber === 1,
      };
      cell.alignment = {
        horizontal: columnNumber === 8 ? "right" : "left",
        vertical: "middle",
      };
      cell.border = {
        bottom: { style: "thin", color: { argb: COLORS.border } },
      };
    });

    row.getCell(2).numFmt = "@";
    row.getCell(7).numFmt = "dd/mm/yyyy";
    row.getCell(8).numFmt = "#,##0";

    const languageCell = row.getCell(5);
    const [languageFill, languageText] = getLanguageColors(languageCell.value);
    languageCell.fill = solidFill(languageFill);
    languageCell.font = {
      ...languageCell.font,
      bold: true,
      color: { argb: languageText },
    };
    languageCell.alignment = { horizontal: "center", vertical: "middle" };

    const statusCell = row.getCell(6);
    const isPublished = statusCell.value === "Published";
    statusCell.fill = solidFill(
      isPublished ? COLORS.publishedFill : COLORS.draftFill,
    );
    statusCell.font = {
      ...statusCell.font,
      bold: true,
      color: {
        argb: isPublished ? COLORS.publishedText : COLORS.draftText,
      },
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

export async function exportBooksExcel(books, options = {}) {
  const workbook = await buildBooksWorkbook(books);
  const buffer = await workbook.xlsx.writeBuffer();
  const dateStamp = new Date().toISOString().slice(0, 10);

  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    options.fileName || `books-${dateStamp}.xlsx`,
  );
}
