import QRCode from "qrcode";
import html2pdf from "html2pdf.js";

export const buildBookQrUrl = (code) =>
  `${window.location.origin}/activate-book?code=${encodeURIComponent(code)}`;

export const buildClassQrUrl = (bookId, code) =>
  `${window.location.origin}/join-class?bookId=${encodeURIComponent(bookId)}&code=${encodeURIComponent(code)}`;

export const generateQrDataUrl = (value, width = 360) =>
  QRCode.toDataURL(value, {
    width,
    margin: 2,
    errorCorrectionLevel: "M",
    color: { dark: "#0f172a", light: "#ffffff" },
  });

export async function downloadQrPdf(items, fileName = "qr-codes.pdf") {
  const cards = await Promise.all(
    items.map(async (item) => ({
      ...item,
      image: await generateQrDataUrl(item.value, 300),
    })),
  );

  const container = document.createElement("div");
  container.style.cssText =
    "width:760px;padding:24px;background:#fff;display:grid;grid-template-columns:1fr 1fr;gap:16px;font-family:Arial,sans-serif;";
  cards.forEach((item) => {
    const card = document.createElement("div");
    card.style.cssText =
      "border:1px solid #dbe3ef;border-radius:12px;padding:16px;text-align:center;break-inside:avoid;";
    const image = document.createElement("img");
    image.src = item.image;
    image.style.cssText = "width:170px;height:170px;";
    const title = document.createElement("div");
    title.textContent = item.title || "QR Code";
    title.style.cssText = "font-size:15px;font-weight:700;margin-top:8px;";
    const code = document.createElement("div");
    code.textContent = item.code || "";
    code.style.cssText = "font-size:13px;letter-spacing:1px;margin-top:5px;";
    const subtitle = document.createElement("div");
    subtitle.textContent = item.subtitle || "";
    subtitle.style.cssText = "font-size:11px;color:#64748b;margin-top:5px;";
    card.append(image, title, code, subtitle);
    container.appendChild(card);
  });

  document.body.appendChild(container);
  try {
    await html2pdf()
      .set({
        margin: 8,
        filename: fileName,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      })
      .from(container)
      .save();
  } finally {
    container.remove();
  }
}
