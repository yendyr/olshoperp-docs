# Requesting Access to Sensitive Data

> **Source:** [https://open.shopee.com/developer-guide/718](https://open.shopee.com/developer-guide/718)
> **Type:** Developer Guide / Overview
> **document_id:** `718`
> **Section:** Getting Started

## Content

Shopee Open Platform safeguards sellers’ business data and users’ personal data considered sensitive (including customer name, phone number, email address, and address).
 
By default, sensitive data is masked. Developers must complete specific security requirements to request access to unmasked sensitive data.
Eligibility RequirementsTo request access to sensitive business data, developers must meet the following conditions:
- Submit Penetration Test Report- Required for Third-party Partner Platform (ISV) Developers serving, or planning to serve, sellers in Thailand, Malaysia, Singapore, or the Philippines, as well as ISVs from China Cross-Border (CNCB) and Hong Kong Cross-Border (HKCB)
- A valid penetration test report must be submitted through the Open Platform Console

- PII Necessity Declaration- Required for all developers whose applications require access to buyer PII.
- Enable the PII Necessity Declaration toggle for applications that require buyer PII access.
- Declare all IP addresses of the servers hosting your application that require access to OpenAPI.
- If your application does not require buyer PII access, keep the toggle OFF.

⚠️ Note: For Third-party Partner Platform (ISV) Developers, approved sensitive data access is valid for two (2) years from the penetration test report’s issue date.
How to Submit a Penetration Test ReportFollow the steps below to upload your penetration test report:
- Step 1: Log in to your Open Platform console using your developer account
Note: Member accounts do not have permission to upload reports.
- Step 2: Navigate to Personal Center → Account Information (Chinese Mainland ISVs: Link (https://open.shopee.cn/console/person/account), Other Region ISVs: Link (https://open.shopee.com/console/person/account))
- Step 3: Under Security Reports & Certifications Information, click "Add"
- Step 4: Under Security Report & Certification Type, Choose “Penetration Test Report”
- Step 5: Upload your latest penetration test report
- Step 6: Click “Save”
Review Timeline
- The submission status (Approved / Rejected) will be updated in the Account Information section.
- Review results are typically available within 10 working days.
 
📌 Please refer to the bottom of this page for best practices and guidelines on penetration test report submissions.
How to Configure PII Necessity DeclarationFollow the steps below to declare whether your application requires access to buyer PII.
- Step 1: Log in to your Open Platform console and navigate to App List. (Chinese Mainland ISVs: Link (https://open.shopee.cn/console/app), Other Region ISVs: Link (https://open.shopee.com/console/app))
- Step 2: Click Go Live and complete the required information.
- Step 3: Under PII Necessity Declaration, locate “Does this App require buyer PII access?”
- Step 4: Select the appropriate setting based on your application's requirements:- Toggle ON if your application requires access to buyer PII.
- Toggle OFF if your application does not require access to buyer PII.

- Step 5: If you toggled the setting ON in Step 4, declare all required IP address(es). Otherwise, skip this step.
⚠️ Important: Please verify your IP addresses carefully before submission. Once buyer PII access is declared, only the IP addresses included in your declared list will be able to access OpenAPI.
- Step 6: Click Submit to save your declaration.
 
Good Practices for Penetration Test Report Submission1. Recommended Testing Providers
To improve report quality and review efficiency, ISVs are encouraged to engage reputable, accredited penetration testers, such as:
- CREST Accredited Penetration Tester
- Offensive Security Certified Professional (OSCP)
- GIAC Certified Penetration Tester (GPEN)
- Certified Ethical Hacker (CEH)
- Certified Information Systems Security Professional (CISSP)
- EC-Council Certified Security Analyst (ECSA)
- CompTIA PenTest+
- AWS Security Competency Partners
- Alibaba Cloud Security Partners
- Qianxin (奇安信)
- 360 数字安全
- Sangfor (深信服)
- Chaitin (长亭科技)
Reports from other penetration testers will still be reviewed and considered for approval on a case-by-case basis.
 
2. Report Quality Requirements
A complete Penetration Test Report should:
- Cover the application's externally exposed attack surface.
- Assess all relevant systems and applications within the testing scope.
- Document the testing methodology, testing process, scope, and detailed findings.
- Include a comprehensive list of identified vulnerabilities.
- Confirm that all vulnerabilities have been remediated.
- Be based on black-box penetration testing.
Please note: Vulnerability scan reports alone are not acceptable and will not satisfy this requirement.
 
3. Recommended Report Issuance Date
- ISVs are encouraged to submit a penetration test report issued within the last one (1) year.
- Sensitive data access will be granted for two (2) years from the report issue date.

## Content (raw HTML)

```html
<p>&nbsp;</p><p>Shopee Open Platform safeguards sellers’ business data and users’ personal data considered sensitive (including customer name, phone number, email address, and address).</p><p>&nbsp;</p><p>By default, sensitive data is masked. Developers must complete specific security requirements to request access to unmasked sensitive data.</p><h3><strong>Eligibility Requirements</strong></h3><p>To request access to sensitive business data, developers must meet the following conditions:</p><ol><li>Submit Penetration Test Report<ul><li><span style="color:#EE4D2D;">Required for Third-party Partner Platform (ISV) Developers serving, or planning to serve, sellers in Thailand, Malaysia, Singapore, or the Philippines, as well as ISVs from China Cross-Border (CNCB) and Hong Kong Cross-Border (HKCB)</span></li><li>A valid penetration test report must be submitted through the Open Platform Console</li></ul></li><li>PII Necessity Declaration<ul><li>Required for all developers whose applications require access to buyer PII.</li><li>Enable the PII Necessity Declaration toggle for applications that require buyer PII access.</li><li>Declare all IP addresses of the servers hosting your application that require access to OpenAPI.</li><li>If your application does not require buyer PII access, keep the toggle OFF.</li></ul></li></ol><p>⚠️ Note: For Third-party Partner Platform (ISV) Developers, approved sensitive data access is valid for<strong><u> two (2) years</u></strong> from the penetration test report’s issue date.</p><h3><strong>How to Submit a Penetration Test Report</strong></h3><p>Follow the steps below to upload your penetration test report:</p><ul><li>Step 1: Log in to your <strong>Open Platform console </strong>using your developer account</li></ul><p class="indent-1"><i>Note: Member accounts do not have permission to upload reports.</i></p><ul><li>Step 2: Navigate to Personal Center → Account Information (<strong>Chinese Mainland ISVs:</strong> <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.cn/console/person/account"><u>Link</u></a>, <strong>Other Region ISVs: </strong><a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/console/person/account"><u>Link</u></a>)</li><li>Step 3: Under Security Reports &amp; Certifications Information, click "Add"</li></ul><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=3nkzhcjEysHs%2BxVIeQP%2BiarSKdEmhwKjczzYD%2FJArvxFyZzMjDJFfVJ8RFX6cNqLFAYlHxz94fUYl8ONlEFGHw%3D%3D&amp;image_type=png"></figure><ul><li>Step 4: Under Security Report &amp; Certification Type, Choose “Penetration Test Report”</li><li>Step 5: Upload your latest penetration test report</li><li>Step 6: Click “Save”</li></ul><figure class="image"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=ukOwqouxK6zyCz8GXhJf1UXdCDjwO%2F%2BPzT61qRe4vZHYPG6QovDt2Yd1bXTHPaxy3FKwqPXsb0870c350msmzQ%3D%3D&amp;image_type=png"></figure><p>Review Timeline</p><ul><li>The submission status (Approved / Rejected) will be updated in the <strong>Account Information</strong> section.</li><li>Review results are typically available within <strong>10 working days</strong>.</li></ul><p class="indent-1">&nbsp;</p><p>📌 Please refer to the bottom of this page for <strong>best practices and guidelines</strong> on penetration test report submissions.</p><h3><strong>How to Configure PII Necessity Declaration</strong></h3><p>Follow the steps below to declare whether your application requires access to buyer PII.</p><ul><li>Step 1: Log in to your Open Platform console and navigate to App List. (Chinese Mainland ISVs: <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.cn/console/app">Link</a>, Other Region ISVs: <a target="_blank" rel="noopener noreferrer" href="https://open.shopee.com/console/app">Link</a>)</li><li>Step 2: Click Go Live and complete the required information.</li><li>Step 3: Under PII Necessity Declaration, locate “Does this App require buyer PII access?”</li><li>Step 4: Select the appropriate setting based on your application's requirements:<ul><li><strong>Toggle ON </strong>if your application requires access to buyer PII.</li><li><strong>Toggle OFF </strong>if your application does not require access to buyer PII.</li></ul></li><li>Step 5: If you toggled the setting ON in Step 4, declare all required IP address(es). Otherwise, skip this step.</li></ul><p class="indent-2">⚠️<strong> Important: </strong>Please verify your IP addresses carefully before submission. Once buyer PII access is declared, only the IP addresses included in your declared list will be able to access OpenAPI.</p><ul><li>Step 6: Click <strong>Submit</strong> to save your declaration.</li></ul><figure class="image image_resized" style="width:1005px;"><img src="https://open.shopee.com/opservice/api/v1/image/download/?image_id=Oe5D%2BO3UdAtKPVWj6Txm3Ji0vEozRUvKIYxnZTgwGDxtLCJH3ZtwHgBCJl8UyDaBDh9FON70sfl6lBpgcwYKAA%3D%3D&amp;image_type=png"></figure><p>&nbsp;</p><h3><strong>Good Practices for Penetration Test Report Submission</strong></h3><p><strong>1. Recommended Testing Providers</strong></p><p>To improve report quality and review efficiency, ISVs are encouraged to engage reputable, accredited penetration testers, such as:</p><ul><li>CREST Accredited Penetration Tester</li><li>Offensive Security Certified Professional (OSCP)</li><li>GIAC Certified Penetration Tester (GPEN)</li><li>Certified Ethical Hacker (CEH)</li><li>Certified Information Systems Security Professional (CISSP)</li><li>EC-Council Certified Security Analyst (ECSA)</li><li>CompTIA PenTest+</li><li>AWS Security Competency Partners</li><li>Alibaba Cloud Security Partners</li><li>Qianxin (奇安信)</li><li>360 数字安全</li><li>Sangfor (深信服)</li><li>Chaitin (长亭科技)</li></ul><p>Reports from other penetration testers will still be <strong>reviewed and considered for approval</strong> on a case-by-case basis.</p><p>&nbsp;</p><p><strong>2. Report Quality Requirements</strong></p><p>A complete Penetration Test Report should:</p><ul><li>Cover the application's externally exposed attack surface.</li><li>Assess all relevant systems and applications within the testing scope.</li><li>Document the testing methodology, testing process, scope, and detailed findings.</li><li>Include a comprehensive list of identified vulnerabilities.</li><li>Confirm that all vulnerabilities have been remediated.</li><li>Be based on <strong>black-box penetration testing</strong>.</li></ul><p><strong>Please note:</strong> Vulnerability scan reports alone are <strong>not</strong> acceptable and will not satisfy this requirement.</p><p>&nbsp;</p><p><strong>3. Recommended Report Issuance Date</strong></p><ul><li>ISVs are encouraged to submit a penetration test report issued within the last <strong>one (1) year</strong>.</li><li>Sensitive data access will be granted for <strong>two (2) years</strong> from the report issue date.</li></ul>
```
