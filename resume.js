// ==========================================
// 1. ACCORDION LOGIC (Smooth UI)
// ==========================================
function toggleAcc(id, element) {
    document.querySelectorAll('.acc-content').forEach(c => c.style.display = 'none');
    document.querySelectorAll('.acc-header').forEach(h => h.classList.remove('active'));
    document.getElementById(id).style.display = 'block';
    element.classList.add('active');
}

// ==========================================
// 2. PROFILE IMAGE LOADER
// ==========================================
function loadImage(event) {
    const imageElement = document.getElementById('out_image');
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) { 
            imageElement.src = e.target.result; 
        }
        reader.readAsDataURL(file);
    }
}

// ==========================================
// 3. DYNAMIC DATA BINDING (Live Preview)
// ==========================================
function toggleVisibility(divId, value) {
    document.getElementById(divId).style.display = (value.trim() === '') ? 'none' : 'block';
}

function updateLive() {
    // Basic Details
    document.getElementById('out_fname').innerText = document.getElementById('inp_fname').value;
    document.getElementById('out_lname').innerText = document.getElementById('inp_lname').value;
    document.getElementById('out_title').innerText = document.getElementById('inp_title').value;
    
    // Personal Details
    const father = document.getElementById('inp_father').value;
    const mother = document.getElementById('inp_mother').value;
    const dob = document.getElementById('inp_dob').value;
    const cast = document.getElementById('inp_cast').value;
    
    document.getElementById('out_father').innerText = father; toggleVisibility('div_father', father);
    document.getElementById('out_mother').innerText = mother; toggleVisibility('div_mother', mother);
    document.getElementById('out_dob').innerText = dob; toggleVisibility('div_dob', dob);
    document.getElementById('out_cast').innerText = cast; toggleVisibility('div_cast', cast);
    
    // Hide Personal Section completely if all are blank
    document.getElementById('sec_personal').style.display = (father || mother || dob || cast) ? 'block' : 'none';

    // Contact Details
    document.getElementById('out_email').innerText = document.getElementById('inp_email').value;
    document.getElementById('out_phone').innerText = document.getElementById('inp_phone').value;
    document.getElementById('out_loc').innerText = document.getElementById('inp_loc').value;
    
    const link = document.getElementById('inp_link').value;
    document.getElementById('out_link').innerText = link; toggleVisibility('div_link', link);
    
    // Summary
    document.getElementById('out_summary').innerText = document.getElementById('inp_summary').value;

    // Experience 1
    const expComp = document.getElementById('inp_exp1_comp').value;
    document.getElementById('out_exp1_comp').innerText = expComp;
    document.getElementById('out_exp1_role').innerText = document.getElementById('inp_exp1_role').value;
    document.getElementById('out_exp1_date').innerText = document.getElementById('inp_exp1_date').value;
    
    // Experience Bullets Formatting
    let expDescHtml = '';
    document.getElementById('inp_exp1_desc').value.split('\n').forEach(line => {
        if(line.trim() !== '') {
            // Remove existing bullets/dashes user might have typed so we don't double them
            expDescHtml += `<li>${line.replace(/^[•\-\*]\s*/, '')}</li>`;
        }
    });
    document.getElementById('out_exp1_desc').innerHTML = expDescHtml;
    document.getElementById('sec_exp').style.display = (expComp) ? 'block' : 'none';

    // Education
    document.getElementById('out_edu1_deg').innerText = document.getElementById('inp_edu1_deg').value;
    document.getElementById('out_edu1_uni').innerText = document.getElementById('inp_edu1_uni').value;
    document.getElementById('out_edu1_year').innerText = document.getElementById('inp_edu1_year').value;

    // Certifications (Other Qualifications)
    const oq1 = document.getElementById('inp_oq1_name').value;
    document.getElementById('out_oq1_name').innerText = oq1;
    document.getElementById('out_oq1_meta').innerText = document.getElementById('inp_oq1_meta').value;
    toggleVisibility('div_oq1', oq1);
    document.getElementById('sec_oq').style.display = (oq1) ? 'block' : 'none';

    // Extracurriculars / Projects
    const otherExp = document.getElementById('inp_otherexp').value;
    let otherExpHtml = '';
    otherExp.split('\n').forEach(line => {
        if(line.trim() !== '') {
            otherExpHtml += `<li>${line.replace(/^[•\-\*]\s*/, '')}</li>`;
        }
    });
    document.getElementById('out_otherexp').innerHTML = otherExpHtml;
    document.getElementById('sec_otherexp').style.display = (otherExp.trim() !== '') ? 'block' : 'none';

    // Skills
    let skillsHtml = ''; 
    document.getElementById('inp_skills').value.split(',').forEach(s => { 
        if(s.trim() !== '') skillsHtml += `<li>${s.trim()}</li>`; 
    });
    document.getElementById('out_skills').innerHTML = skillsHtml;

    // Languages
    let langsHtml = ''; 
    document.getElementById('inp_langs').value.split(',').forEach(l => { 
        if(l.trim() !== '') langsHtml += `<li>${l.trim()}</li>`; 
    });
    document.getElementById('out_langs').innerHTML = langsHtml;
}

// Ensure the page updates immediately when loaded so defaults are shown
window.addEventListener('DOMContentLoaded', () => {
    updateLive();
});

// ==========================================
// 4. SMART HD PDF GENERATION (Bug Fixed)
// ==========================================
function downloadResume() {
    // We target 'print-area' specifically. html2pdf will clone this 
    // and render it in the background, ignoring the wrapper's scale.
    const element = document.getElementById('print-area');
    const btn = document.querySelector('.preview-panel .action-btn');
    
    // Dynamic File Naming based on User's First Name
    let fName = document.getElementById('inp_fname').value.trim();
    if(fName === '') fName = "My";
    const fileName = fName + "_Resume_NiyuktiAssam.pdf";
    
    // High-Quality PDF Options
    const opt = {
        margin:       0,
        filename:     fileName,
        image:        { type: 'jpeg', quality: 1.0 }, // Max quality
        html2canvas:  { scale: 3, useCORS: true, logging: false }, // Scale 3 gives sharp text
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // UI Feedback: Change button text while processing
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="material-icons" style="animation: spin 2s linear infinite;">autorenew</span> Generating HD PDF...';
    btn.style.pointerEvents = 'none'; // Prevent double clicks
    
    // Generate and Save
    html2pdf().set(opt).from(element).save().then(() => {
        // Restore Button Text
        btn.innerHTML = originalText;
        btn.style.pointerEvents = 'auto';
    }).catch(err => {
        console.error("PDF Generation Error: ", err);
        alert("Oops! Something went wrong while generating the PDF. Please try again.");
        btn.innerHTML = originalText;
        btn.style.pointerEvents = 'auto';
    });
}