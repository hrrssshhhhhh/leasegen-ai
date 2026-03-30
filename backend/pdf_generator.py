import os
import uuid

from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER

# ✅ FIXED PATH
BASE_DIR = os.path.dirname(os.path.abspath(__file__))   # backend folder
OUTPUT_DIR = os.path.join(os.path.dirname(BASE_DIR), "generated_pdfs")  # root folder

os.makedirs(OUTPUT_DIR, exist_ok=True)


def generate_pdf(lease_text: str):

    filename = f"lease_{uuid.uuid4().hex[:8]}.pdf"
    path = os.path.join(OUTPUT_DIR, filename)

    styles = getSampleStyleSheet()

    # ✅ Title Style (Centered)
    title_style = ParagraphStyle(
        "Title",
        parent=styles["Heading1"],
        fontSize=18,
        alignment=TA_CENTER,
        spaceAfter=20
    )

    # ✅ Header Style
    header_style = ParagraphStyle(
        "Header",
        parent=styles["Heading3"],
        fontSize=13,
        spaceBefore=12,
        spaceAfter=6,
        leading=14
    )

    # ✅ Body Style
    body_style = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        fontSize=11,
        leading=16,
        spaceAfter=6
    )

    story = []
    lines = lease_text.split("\n")

    for i, line in enumerate(lines):
        text = line.strip()

        if not text:
            story.append(Spacer(1, 10))
            continue

        # ✅ Title (First line)
        if i == 0:
            story.append(Paragraph(text, title_style))

        # ✅ Section Headers
        elif text.isupper():
            story.append(Spacer(1, 12))
            story.append(Paragraph(f"<b>{text}</b>", header_style))

        # ✅ Body Text
        else:
            story.append(Paragraph(text, body_style))

    # ✅ Signature Section
    story.append(Spacer(1, 30))

    story.append(Paragraph("<b>LANDLORD SIGNATURE</b>", header_style))
    story.append(Spacer(1, 12))
    story.append(Paragraph("______________________________", body_style))

    story.append(Spacer(1, 20))

    story.append(Paragraph("<b>TENANT SIGNATURE</b>", header_style))
    story.append(Spacer(1, 12))
    story.append(Paragraph("______________________________", body_style))

    story.append(Spacer(1, 20))

    story.append(Paragraph("<b>DATE</b>", header_style))
    story.append(Spacer(1, 12))
    story.append(Paragraph("______________________________", body_style))

    # ✅ Page Header
    def add_page_header(canvas, doc):
        canvas.setFont("Helvetica-Bold", 10)
        canvas.drawString(72, 750, "Residential Lease Agreement - Florida")

    # ✅ Build PDF
    doc = SimpleDocTemplate(
        path,
        pagesize=letter,
        leftMargin=1 * inch,
        rightMargin=1 * inch,
        topMargin=1 * inch,
        bottomMargin=1 * inch
    )

    doc.build(
        story,
        onFirstPage=add_page_header,
        onLaterPages=add_page_header
    )

    print("✅ PDF saved at:", path)

    
    return filename