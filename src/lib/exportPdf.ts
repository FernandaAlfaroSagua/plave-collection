import jsPDF from "jspdf";
import {Card} from "@/types/photocard.type";

// Helper para convertir imagen URL a base64
async function getImageBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export const generateCollectionPDF = async (
  cards: Card[],
  title: string,
  fileName: string,
) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.setTextColor(236, 72, 153); // Rosa PLAVE
  doc.text(title, 14, 20);

  // Ordenar eras igual que en DashboardContent (por release_date más reciente)
  // 1. Crear un mapa era -> fecha más reciente
  const eraMap = new Map();
  for (const card of cards) {
    const time = Date.parse(card.release_date);
    const currentMax = eraMap.get(card.era);
    if (currentMax === undefined || time > currentMax) {
      eraMap.set(card.era, time);
    }
  }
  // 2. Ordenar eras por fecha descendente
  const eras = Array.from(eraMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([era]) => era);

  let currentY = 30;
  const imgWidth = 36; // Ajustado para quepan 5 en A4 (con margen)
  const imgHeight = 54;
  const gap = 7;
  const cols = 5;
  const pageWidth = 210;
  const marginX = (pageWidth - (cols * imgWidth + (cols - 1) * gap)) / 2;

  for (const era of eras) {
    const eraCards = cards
      .filter((c) => c.era === era)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

    // Si no cabe el título de la era, saltar página
    if (currentY + imgHeight > 270) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.text(era, marginX, currentY);
    currentY += 8;

    let col = 0;
    let rowY = currentY;

    for (let i = 0; i < eraCards.length; i++) {
      // Si la siguiente fila no cabe, saltar página
      if (rowY + imgHeight + 15 > 270) {
        doc.addPage();
        rowY = 20;
      }

      const card = eraCards[i];
      const x = marginX + col * (imgWidth + gap);
      // Cargar imagen
      let imgBase64 = null;
      if (card.image_url && card.image_url.includes("cloudinary")) {
        imgBase64 = await getImageBase64(card.image_url);
      }
      // Dibujar imagen
      if (imgBase64) {
        try {
          // Borde rosa
          doc.setDrawColor(236, 72, 153);
          doc.setLineWidth(2);
          doc.rect(x, rowY, imgWidth, imgHeight);
          // Imagen
          doc.addImage(imgBase64, "JPEG", x, rowY, imgWidth, imgHeight);
        } catch {}
      } else {
        // Si no hay imagen, dibujar rectángulo vacío con borde rosa
        doc.setDrawColor(236, 72, 153);
        doc.setLineWidth(2);
        doc.rect(x, rowY, imgWidth, imgHeight);
      }
      // Nombre debajo
      doc.setFontSize(10);
      doc.setTextColor(40);
      const storeName =
        card.store === "Universal Music Store" ? "UMS" : card.store;
      doc.text(
        `${storeName ? storeName + " (" + card.type + ")" : card.type}`,
        x + imgWidth / 2,
        rowY + imgHeight + 5,
        {
          align: "center",
        },
      );

      col++;
      if (col >= cols) {
        col = 0;
        rowY += imgHeight + 15;
      }
    }
    // Después de la era, dejar espacio para la siguiente
    currentY = rowY + imgHeight + 15;
    if (currentY > 270) {
      doc.addPage();
      currentY = 20;
    }
  }

  doc.save(`${fileName}.pdf`);
};
