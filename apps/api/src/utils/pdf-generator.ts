import * as PDFDocument from 'pdfkit';

export async function generatePDF(meetups): Promise<Buffer> {
  const pdfBuffer: Buffer = await new Promise((resolve) => {
    const doc = new PDFDocument({
      size: 'LETTER',
      bufferPages: true,
    });

    doc.fontSize(30).text('Meetups');
    doc.moveDown();

    for (const meetup of meetups) {
      doc.fontSize(18).text(` ${meetup.title}`, {
        width: 410,
        align: 'center',
      });
      doc.text(`Description: ${meetup.description}`);
      const tagsString = meetup.tags.join(', ');
      doc.text(`Tags: ${tagsString}`);
      doc.text(`Time: ${meetup.meetingTime}`);
      doc.text(`Latitude: ${meetup.latitude}`);
      doc.text(`Longitude: ${meetup.longitude}`);
      doc.moveDown();
    }

    doc.moveDown();

    const buffer = [];
    doc.on('data', buffer.push.bind(buffer));
    doc.on('end', () => {
      const data = Buffer.concat(buffer);
      resolve(data);
    });
    doc.end();
  });

  return pdfBuffer;
}
