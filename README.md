# Indeed Job Automation → Google Sheets (100% Free)

This project automatically fetches job listings from Indeed using the **omkar.cloud** free API and appends them to your Google Sheet with columns:

- Corporation  
- Designation  
- Experience Required  
- Location  
- Skills Required  

**No credit card, no bank account, no Google Cloud Console service account required.**

---

## 🔗 Your Google Sheet
[https://docs.google.com/spreadsheets/d/1r6Hta4H9zItMpQYEKiX27MoDDeohcRbPfyl5tVydAjo/edit](https://docs.google.com/spreadsheets/d/1r6Hta4H9zItMpQYEKiX27MoDDeohcRbPfyl5tVydAjo/edit)

---

## 🛠️ How to Set Up

### 1. Get a Free Indeed API Key
- Go to [https://www.omkar.cloud/auth/sign-up](https://www.omkar.cloud/auth/sign-up)  
- Sign up for a free account (100 free queries/month, **no credit card**)  
- Copy your API key

### 2. Open Your Google Sheet
- Open the link above  
- Go to **Extensions → Apps Script**

### 3. Paste the Code
- Delete all default code  
- Copy the entire content from `src/script.gs` in this repo  
- Paste it into the Apps Script editor  

### 4. Securely Store Your API Key
- In the Apps Script editor, find the function `setApiKey()`  
- Replace `YOUR_ACTUAL_API_KEY_HERE` with your real key  
- Run `setApiKey()` **once** (it stores the key securely inside Google's PropertiesService)  
- After running, you can delete the hardcoded key from the function (or leave it – but never push it to GitHub)

### 5. Run the Automation
- Click **Run** → select `fetchIndeedJobs`  
- Grant permissions when asked (this is safe – your Google account only)  
- Jobs will appear in your sheet

### 6. Schedule Automatic Runs
- In Apps Script, click the **clock icon** (Triggers) on the left  
- Click **+ Add Trigger**  
- Choose function: `fetchIndeedJobs`  
- Choose time-driven (e.g., every hour or daily)  
- Save

---

## 📂 Repository Structure
indeed-job-automation/
├── README.md
├── .gitignore
├── .env.example
└── src/
└── script.gs