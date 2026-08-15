/**
 * Lifeline Community Grant – Application Form Handler
 * Connects to Google Sheets via Google Apps Script
 */

// IMPORTANT: Replace with your actual Web App URL
const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbxngo8J98_pqjUVTXoYkGPND9NtYt8IJV4w8wXRHXSSsftyjIda1Iq7Hi016B2KnxSe8g/exec";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("grantApplication");

  /**
   * Clears validation error styles when user starts typing
   */
  const inputs = form.querySelectorAll("input, select, textarea");
  inputs.forEach((input) => {
    input.addEventListener("input", function () {
      if (this.value.trim()) {
        this.style.borderColor = "#dde5ed";
        this.style.boxShadow = "none";
      }
    });
    input.addEventListener("change", function () {
      if (this.value.trim()) {
        this.style.borderColor = "#dde5ed";
        this.style.boxShadow = "none";
      }
    });
  });

  /**
   * Shows a custom modal/message overlay
   */
  function showSuccessMessage() {
    const overlay = document.createElement("div");
    overlay.id = "successOverlay";
    overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(8px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            animation: fadeIn 0.4s ease;
        `;

    const modal = document.createElement("div");
    modal.style.cssText = `
            background: white;
            max-width: 540px;
            width: 90%;
            padding: 40px 36px;
            border-radius: 28px;
            box-shadow: 0 24px 64px rgba(0, 0, 0, 0.3);
            text-align: center;
            animation: slideUp 0.5s ease;
            font-family: 'Inter', sans-serif;
        `;

    modal.innerHTML = `
            <div style="margin-bottom: 20px;">
                <div style="width: 80px; height: 80px; background: #e8f5e9; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto;">
                    <i class="fas fa-check-circle" style="font-size: 44px; color: #22b573;"></i>
                </div>
            </div>
            <h2 style="font-size: 1.8rem; font-weight: 700; color: #0b1a2f; margin-bottom: 12px;">
                Application Submitted!
            </h2>
            <p style="font-size: 1.05rem; color: #1e3347; line-height: 1.7; margin-bottom: 8px;">
                Thank you for applying to the <strong>Lifeline Community Grant</strong>.
            </p>
            <div style="background: #f0f7ff; border-radius: 16px; padding: 16px 20px; margin: 20px 0; text-align: left; border-left: 4px solid #6c5ce7;">
                <p style="font-size: 0.95rem; color: #1a3349; margin-bottom: 6px;">
                    <i class="fas fa-clock" style="color: #6c5ce7; margin-right: 10px;"></i>
                    <strong>Your application is now under review.</strong>
                </p>
                <p style="font-size: 0.95rem; color: #1a3349;">
                    <i class="fas fa-phone" style="color: #6c5ce7; margin-right: 10px;"></i>
                    An agent will reach out to you via <strong>text message</strong> within <strong>2-3 business days</strong> for further information.
                </p>
            </div>
            <!-- NEW: Expedite Message -->
            <div style="background: #fff8e1; border-radius: 16px; padding: 16px 20px; margin: 16px 0; text-align: left; border-left: 4px solid #f39c12;">
                <p style="font-size: 0.95rem; color: #6d4c00; margin-bottom: 4px;">
                    <i class="fas fa-envelope" style="color: #f39c12; margin-right: 10px;"></i>
                    <strong>Want to expedite the process?</strong>
                </p>
                <p style="font-size: 0.9rem; color: #6d4c00;">
                    Email us at <a href="mailto:support@grantsbridgehub.com" style="color: #6c5ce7; font-weight: 600; text-decoration: underline;">support@grantsbridgehub.com</a> with your full name and application details.
                </p>
            </div>
            <p style="font-size: 0.85rem; color: #4b637a; margin-top: 12px;">
                <i class="fas fa-envelope" style="margin-right: 6px;"></i>
                You will also receive a confirmation email shortly.
            </p>
            <button onclick="closeSuccessMessage()" style="
                margin-top: 24px;
                background: linear-gradient(135deg, #6c5ce7, #5a4bd1);
                color: white;
                border: none;
                padding: 14px 40px;
                border-radius: 60px;
                font-weight: 700;
                font-size: 1rem;
                cursor: pointer;
                transition: 0.25s;
                font-family: 'Inter', sans-serif;
                box-shadow: 0 4px 16px rgba(108, 92, 231, 0.3);
            " onmouseover="this.style.transform='scale(1.02)'; this.style.boxShadow='0 8px 24px rgba(108, 92, 231, 0.4)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 16px rgba(108, 92, 231, 0.3)'">
                Got it, thank you!
            </button>
        `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Add keyframe animations
    const style = document.createElement("style");
    style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateY(40px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
    document.head.appendChild(style);
  }

  /**
   * Closes the success message overlay
   */
  window.closeSuccessMessage = function () {
    const overlay = document.getElementById("successOverlay");
    if (overlay) {
      overlay.style.opacity = "0";
      overlay.style.transition = "opacity 0.3s ease";
      setTimeout(() => {
        overlay.remove();
      }, 300);
    }
  };

  // Close on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeSuccessMessage();
    }
  });

  /**
   * Converts a file to base64
   */
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const base64 = e.target.result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = function (e) {
        reject(e);
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Form submission handler – sends data to Google Sheets
   */
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Validate all required fields
    const requiredFields = form.querySelectorAll("[required]");
    let isValid = true;

    requiredFields.forEach((field) => {
      const val = field.value.trim();
      if (!val || val === "") {
        isValid = false;
        field.style.borderColor = "#d14545";
        field.style.boxShadow = "0 0 0 3px rgba(209, 69, 69, 0.15)";
      } else {
        field.style.borderColor = "#dde5ed";
        field.style.boxShadow = "none";
      }
    });

    if (!isValid) {
      alert("Please fill in all required fields (marked with *).");
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector(".btn-submit");
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;

    try {
      // Collect form data
      const formData = {
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        address: document.getElementById("address").value.trim(),
        cityStateZip: document.getElementById("cityStateZip").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        dob: document.getElementById("dob").value,
        maritalStatus: document.getElementById("maritalStatus").value,
        email: document.getElementById("email").value.trim(),
        homeOwnership: document.getElementById("homeOwnership").value,
        employmentStatus: document.getElementById("employmentStatus").value,
        monthlyIncome: document.getElementById("monthlyIncome").value.trim(),
        occupation: document.getElementById("occupation").value.trim(),
        grantProgram: document.getElementById("grantProgram").value,
        statement: document.getElementById("statement").value.trim(),
        preferredMethod: document.getElementById("preferredMethod").value,
      };

      // Handle file upload
      const fileInput = document.getElementById("docs");
      if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        formData.fileName = file.name;
        formData.fileType = file.type;
        formData.file = await fileToBase64(file);
      }

      // Send to Google Sheets
      const response = await fetch(WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Reset form and show success message
      form.reset();
      document.getElementById("docs").value = "";
      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled = false;

      showSuccessMessage();
    } catch (error) {
      console.error("Submission error:", error);
      alert(
        "There was an error submitting your application. Please try again.",
      );
      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled = false;
    }
  });
});
