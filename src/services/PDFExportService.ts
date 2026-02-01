import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { NotationData, NotationType } from '../types/music';

class PDFExportService {
  async exportToPDF(
    notationElement: HTMLElement,
    notationData: NotationData,
    notationType: NotationType,
    filename: string = 'music-notation.pdf'
  ): Promise<void> {
    try {
      // Capture the notation as canvas
      const canvas = await html2canvas(notationElement, {
        scale: 2,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      // Add title
      pdf.setFontSize(18);
      pdf.text('Music Notation', 10, 15);

      // Add metadata
      pdf.setFontSize(10);
      pdf.text(`Notation Type: ${notationType === 'staff' ? 'Staff Notation' : 'Numbered Notation (Jianpu)'}`, 10, 25);
      pdf.text(`Tempo: ${notationData.tempo} BPM`, 10, 30);
      pdf.text(`Instrument: ${notationData.instrument}`, 10, 35);
      pdf.text(`Time Signature: ${notationData.timeSignatures[0].numerator}/${notationData.timeSignatures[0].denominator}`, 10, 40);
      pdf.text(`Notes: ${notationData.notes.length}`, 10, 45);

      // Add notation image
      const yOffset = 55;
      const availableHeight = pdf.internal.pageSize.getHeight() - yOffset - 10;
      const finalHeight = Math.min(imgHeight, availableHeight);

      pdf.addImage(imgData, 'PNG', 10, yOffset, imgWidth - 20, finalHeight);

      // Add lyrics if present
      if (notationData.lyrics.length > 0) {
        const lyricsText = notationData.lyrics.join(' ');
        pdf.addPage();
        pdf.setFontSize(14);
        pdf.text('Lyrics', 10, 15);
        pdf.setFontSize(11);
        const splitLyrics = pdf.splitTextToSize(lyricsText, imgWidth - 20);
        pdf.text(splitLyrics, 10, 25);
      }

      // Save the PDF
      pdf.save(filename);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      throw error;
    }
  }
}

export default new PDFExportService();
