document.addEventListener('DOMContentLoaded', function () {
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const pdfPreview = document.getElementById('pdfPreview');
    const momContent = document.getElementById('momContent');

    generateBtn.addEventListener('click', generatePreview);
    downloadBtn.addEventListener('click', downloadPDF);

    function generatePreview() {
        // Get all input values
        const department = document.getElementById('department').value;
        const date = document.getElementById('date').value;
        const startTime = document.getElementById('startTime').value;
        const endTime = document.getElementById('endTime').value;
        const agenda = document.getElementById('agenda').value;
        const absentees = document.getElementById('absentees').value;
        const minutes = document.getElementById('minutes').value;

        // Format the date
        const formattedDate = formatDate(date);

        // Process absentees and minutes (split by semicolon)
        const absenteesList = absentees.split(';').filter(name => name.trim() !== '');
        const minutesPoints = minutes.split(';').filter(point => point.trim() !== '');

        // Generate the MOM content
        let momHTML = `
            <h1 class="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyber-teal to-cyber-blue">
                MINUTES OF MEETING
            </h1>
            
            <div class="mb-6 border-b border-gray-700 pb-4">
                <p class="font-semibold text-cyber-teal">Domain: <span class="text-gray-200">${department || 'Not specified'}</span></p>
                <p class="font-semibold text-cyber-teal">Date: <span class="text-gray-200">${formattedDate || 'Not specified'}</span></p>
                <p class="font-semibold text-cyber-teal">Time: <span class="text-gray-200">${formatTime(startTime) || 'Not specified'} - ${formatTime(endTime) || 'Not specified'}</span></p>
            </div>
            
            <div class="mb-6">
                <h2 class="text-xl font-semibold mb-2 text-cyber-blue">Agenda:</h2>
                <p class="text-gray-300 pl-4">${agenda || 'No agenda specified'}</p>
            </div>
            
            <div class="mb-6">
                <h2 class="text-xl font-semibold mb-2 text-cyber-blue">Meeting Minutes:</h2>
                <ol class="list-decimal pl-6 space-y-2 text-gray-300">
                    ${minutesPoints.map((point, index) => `
                        <li class="border-l-2 border-cyber-purple/50 pl-3">${point.trim()}</li>
                    `).join('')}
                    ${minutesPoints.length === 0 ? '<li class="text-gray-500">No minutes recorded</li>' : ''}
                </ol>
            </div>
            
            <div class="mb-6">
                <h2 class="text-xl font-semibold mb-2 text-cyber-blue">Absentees:</h2>
                <ol class="list-decimal pl-6 space-y-1 text-gray-300">
                    ${absenteesList.map((name, index) => `
                        <li>${name.trim()}</li>
                    `).join('')}
                    ${absenteesList.length === 0 ? '<li class="text-gray-500">None</li>' : ''}
                </ol>
            </div>
            
            <div class="text-xs text-gray-500 text-right mt-8">
                Team Elabs
            </div>
        `;

        momContent.innerHTML = momHTML;
        pdfPreview.classList.remove('hidden');

        // Scroll to preview
        pdfPreview.scrollIntoView({ behavior: 'smooth' });
    }

    async function downloadPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Add loading state to button
        downloadBtn.innerHTML = 'Generating PDF...';
        downloadBtn.disabled = true;

        try {
            // 1. Load your custom border image
            const borderImage = await loadImage('./components/frame.png');

            // 2. Add the border image to the PDF (scaled to A4 width)
            const imgWidth = 210; // A4 width in mm
            const imgHeight = (borderImage.height * imgWidth) / borderImage.width;
            doc.addImage(borderImage, 'PNG', 0, 0, imgWidth, imgHeight);

            // 3. Get all input values
            const department = document.getElementById('department').value;
            const date = document.getElementById('date').value;
            const startTime = document.getElementById('startTime').value;
            const endTime = document.getElementById('endTime').value;
            const agenda = document.getElementById('agenda').value;
            const absentees = document.getElementById('absentees').value;
            const minutes = document.getElementById('minutes').value;

            // 4. Format the data
            const formattedDate = formatDate(date);
            const absenteesList = absentees.split(';').filter(name => name.trim() !== '');
            const minutesPoints = minutes.split(';').filter(point => point.trim() !== '');

            // 5. Set PDF metadata
            doc.setProperties({
                title: `MOM - ${department || 'Meeting'}`,
                subject: 'Minutes of Meeting',
                author: 'MOM Generator'
            });

            // 6. Add content to PDF with adjusted positions to account for border
            const contentStartY = 42; // Start below the border
            let yPosition = contentStartY;

            // Main heading
doc.setFontSize(28);
doc.setFont(undefined, 'bold');
doc.setTextColor(0, 0, 0);

// 1. First add the text (centered)
const titleText = 'MINUTES OF MEETING';
const textWidth = doc.getStringUnitWidth(titleText) * doc.getFontSize() / doc.internal.scaleFactor;
doc.text(titleText, 105, yPosition, { align: 'center' });

// 2. Then add the manual underline
const underlineY = yPosition + 2; // 2mm below text
const centerX = 105; // Same center as text
doc.line(
  centerX - textWidth/2, // Start X (left position)
  underlineY,            // Y position
  centerX + textWidth/2, // End X (right position)
  underlineY             // Y position
);

yPosition += 25; // Adjust spacing as needed
            // Set consistent left margin and spacing
            const labelLeftMargin = 20;  // 20mm from left
            const valueLeftMargin = 40;  // 40mm from left (20mm after label)

            doc.setFontSize(12);

            // Domain
            doc.setFont(undefined, 'bold');
            doc.text('Domain:', labelLeftMargin, yPosition);
            doc.setFont(undefined, 'normal');
            doc.text(`${department || 'Not specified'}`, valueLeftMargin, yPosition);
            yPosition += 8;

            // Date
            doc.setFont(undefined, 'bold');
            doc.text('Date:', labelLeftMargin, yPosition);
            doc.setFont(undefined, 'normal');
            doc.text(`${formattedDate || 'Not specified'}`, valueLeftMargin, yPosition);
            yPosition += 8;

            // Time
            doc.setFont(undefined, 'bold');
            doc.text('Time:', labelLeftMargin, yPosition);
            doc.setFont(undefined, 'normal');
            doc.text(`${formatTime(startTime) || 'Not specified'} to ${formatTime(endTime) || 'Not specified'}`,
                valueLeftMargin, yPosition);
            yPosition += 8;

            // Agenda
            doc.setFont(undefined, 'bold');
            doc.text('Agenda:', labelLeftMargin, yPosition);
            doc.setFont(undefined, 'normal');
            doc.text(`${agenda || 'Not specified'}`, valueLeftMargin, yPosition);
            yPosition += 8;

            // Horizontal line
            doc.line(15, yPosition, 195, yPosition);
            yPosition += 10;


            // Discussed points
            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');  // Set font to bold
            doc.text('Discussed:', 20, yPosition);  // Changed - to : for consistency
            doc.setFont(undefined, 'normal');  // Reset to normal font
            yPosition += 10;
            doc.setFontSize(14);

            minutesPoints.forEach((point, index) => {
                if (yPosition > 270) { // Prevent overflow
                    doc.addPage();
                    // Add border to new page if needed
                    doc.addImage(borderImage, 'PNG', 0, 0, imgWidth, imgHeight);
                    yPosition = contentStartY;
                }
                //doc.text(`${index + 1}. ${point.trim()}`, 25, yPosition);
                doc.text(`• ${point.trim()}`, 40, yPosition);
                yPosition += 10;
            });

            yPosition += 15;

            // Absentees
            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');  // Set font to bold
            doc.text('Absentees:', 20, yPosition);  // Changed - to : for consistency
            doc.setFont(undefined, 'normal');  // Reset to normal font
            yPosition += 10;
            doc.setFontSize(12);

            absenteesList.forEach((name, index) => {
                if (yPosition > 270) { // Prevent overflow
                    doc.addPage();
                    // Add border to new page if needed
                    doc.addImage(borderImage, 'PNG', 0, 0, imgWidth, imgHeight);
                    yPosition = contentStartY;
                }
                doc.text(`${index + 1}. ${name.trim()}`, 25, yPosition);
                yPosition += 5;
            });

            // Footer
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text('Team Elabs', 105, 287, { align: 'center' });

            // 7. Save the PDF
            doc.save(`MOM_${department || 'Meeting'}_${formattedDate || ''}.pdf`);

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            // Reset button state
            downloadBtn.innerHTML = 'Download PDF';
            downloadBtn.disabled = false;
        }
    }

    // Helper function to load image
    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    function formatTime(timeString) {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        return `${hours}:${minutes}`;
    }
});