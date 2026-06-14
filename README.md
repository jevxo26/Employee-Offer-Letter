# JEVXO Automated Appointment Letter & Partnership Agreement System

A modern HR automation platform developed for JEVXO to streamline partner onboarding, appointment letter generation, partnership agreements, digital signatures, employee ID card generation, PDF export, and email-based document delivery.

---

## Overview

The JEVXO Automated Documentation System enables founders and administrators to generate legally structured onboarding documents, collect digital signatures, and distribute agreements electronically through a secure workflow.

The platform eliminates manual document preparation and provides a scalable onboarding process for future partners, employees, and stakeholders.

---

## Core Features

### Appointment Letter Generation

Generate professional appointment letters dynamically using partner information.

Supported Fields:

* Partner Name
* Position / Role
* Date of Birth
* National ID
* Mobile Number
* Email Address
* Present Address
* Permanent Address
* Guardian Information
* Equity Percentage
* Probation Period
* Notice Period

---

### Partnership Agreement Generation

Automatically generate partnership agreements with dynamic company and partner information.

---

### Digital Signature Workflow

#### Founder Signature

Supports:

* Draw Signature
* Upload Signature Image

Stored as:

```javascript
firstParty.signatureImg
```

#### Partner Signature

Partners can digitally sign agreements through a dedicated candidate portal.

Stored as:

```javascript
secondParty.signatureImg
```

---

### PDF Generation

Generate production-ready A4 PDFs using:

* jsPDF
* html2canvas-pro

Features:

* Multi-page document rendering
* Watermark support
* Dynamic signatures
* Corporate document formatting
* High-resolution export

---

### Employee ID Card Generator

Generate employee ID cards directly from onboarding information.

Front Side:

* Employee Photo
* Employee Name
* Position
* Blood Group
* Employee ID
* Employee Verification QR

Back Side:

* Company Information
* Verification QR
* Important Information

Export Formats:

* PDF
* PNG

---

### Candidate Portal

Secure onboarding experience for candidates.

Features:

* No login required
* Personalized invitation links
* View appointment documents
* Sign agreements digitally
* Download countersigned PDF

URL Structure:

```txt
/?candidateView={token}
```

---

### Email Delivery System

Integrated with Resend Email API.

Capabilities:

* Direct document invitation emails
* Personalized onboarding links
* Automated candidate communication
* Company-branded email delivery

Supported Sender:

```txt
info@jevxo.com
```

Fallback Sender:

```txt
onboarding@resend.dev
```

---

## Technology Stack

### Frontend

* Next.js
* TypeScript
* Tailwind CSS v4

### UI & Animations

* Lucide React
* Framer Motion

### Document Generation

* jsPDF
* html2canvas-pro

### Email Service

* Resend API

### QR Generation

* qrcode.react

---

## Workflow

### Founder Workflow

```txt
Login
    ↓
Fill Partner Information
    ↓
Configure Agreement Terms
    ↓
Attach Founder Signature
    ↓
Generate Documents
    ↓
Send Offer Email
```

---

### Candidate Workflow

```txt
Receive Email
    ↓
Open Invitation Link
    ↓
Review Documents
    ↓
Provide Signature
    ↓
Download Signed PDF
```

---

## Local Storage Strategy

Document data is temporarily stored using:

```txt
jevxo_offer_{id}
```

Stored Data:

* First Party Information
* Second Party Information
* Document Settings
* Signature Assets

---

## Security Notes

* Founder workspace is login protected.
* Candidate access is token based.
* Sensitive API keys should be stored in environment variables.
* Production deployment should use secure backend APIs instead of exposing secret keys in frontend code.

---

## Future Roadmap

### Phase 2

* Database Integration
* Employee Management Dashboard
* Verification Portal
* Automated Employee IDs
* Offer Tracking System
* HR Analytics

### Phase 3

* Multi-Company Support
* E-Signature Audit Logs
* Partner Performance Tracking
* Equity Management Dashboard
* Document Versioning

---

## Developed For

JEVXO

- A global subscription-based digital business ecosystem.

Official Email:
[info@jevxo.com](mailto:info@jevxo.com)

---

## License

Internal Proprietary Software

This software is developed exclusively for JEVXO and is not intended for public redistribution without authorization.
