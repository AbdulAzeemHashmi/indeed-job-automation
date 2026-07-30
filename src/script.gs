// ============================================================
// INDEED JOB AUTOMATION – Google Apps Script
// Works with your Google Sheet:
// https://docs.google.com/spreadsheets/d/1r6Hta4H9zItMpQYEKiX27MoDDeohcRbPfyl5tVydAjo
// Columns: Corporation | Designation | Experience Required | Location | Skills Required
// ============================================================

// -----------------------------------------------------------------
// STEP 1: RUN THIS FUNCTION ONCE to store your API key securely
// -----------------------------------------------------------------
function setApiKey() {
  // Replace the dummy key below with your real key from omkar.cloud
  var key = 'YOUR_ACTUAL_API_KEY_HERE';
  PropertiesService.getScriptProperties().setProperty('INDEED_API_KEY', key);
  Logger.log('✅ API Key saved securely in ScriptProperties.');
}

// -----------------------------------------------------------------
// MAIN FUNCTION: Fetch jobs from Indeed and append to the sheet
// -----------------------------------------------------------------
function fetchIndeedJobs() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Retrieve the API key from secure storage
  var apiKey = PropertiesService.getScriptProperties().getProperty('INDEED_API_KEY');
  
  if (!apiKey) {
    sheet.appendRow(['❌ ERROR: API Key not set. Run setApiKey() first.']);
    return;
  }

  // ===== CONFIGURE YOUR SEARCH =====
  var SEARCH_TERM = 'software engineer';   // Change to your desired job title
  var LOCATION = 'United States';          // Change to your preferred country/city
  // ===================================

  var url = 'https://indeed-scraper.omkar.cloud/indeed/search';
  var params = {
    'search_term': SEARCH_TERM,
    'location': LOCATION,
    'page': 1
  };

  // Build query string
  var queryString = Object.keys(params)
    .map(k => k + '=' + encodeURIComponent(params[k]))
    .join('&');
  var fullUrl = url + '?' + queryString;

  var options = {
    'headers': { 'API-Key': apiKey },
    'method': 'get',
    'muteHttpExceptions': true
  };

  try {
    var response = UrlFetchApp.fetch(fullUrl, options);
    var data = JSON.parse(response.getContentText());
    
    // The API returns jobs inside 'jobs' or 'results' array
    var jobs = data.jobs || data.results || [];

    if (jobs.length === 0) {
      sheet.appendRow(['⚠️ No jobs found for this search.']);
      return;
    }

    // Loop through each job and add a row
    for (var i = 0; i < jobs.length; i++) {
      var job = jobs[i];
      var description = job.description_snippet || job.description || '';

      var row = [
        job.company || 'N/A',
        job.title || 'N/A',
        extractExperience(description),
        job.location || 'N/A',
        extractSkills(description)
      ];
      sheet.appendRow(row);
    }

    // Footer with timestamp
    sheet.appendRow(['--- ✅ Fetched ' + jobs.length + ' jobs on ' + new Date() + ' ---']);

  } catch (e) {
    sheet.appendRow(['❌ ERROR: ' + e.toString()]);
  }
}

// -----------------------------------------------------------------
// HELPER 1: Extract experience from description
// -----------------------------------------------------------------
function extractExperience(text) {
  var patterns = [
    /(\d+)\+?\s*years?/i,
    /(\d+)\s*-\s*(\d+)\s*years?/i,
    /experience:?\s*(\d+)/i,
    /(\d+)\s*year/i
  ];
  for (var i = 0; i < patterns.length; i++) {
    var match = text.match(patterns[i]);
    if (match) return match[0];
  }
  return 'Not specified';
}

// -----------------------------------------------------------------
// HELPER 2: Extract common skills from description
// -----------------------------------------------------------------
function extractSkills(text) {
  var commonSkills = [
    'Python', 'Java', 'JavaScript', 'React', 'Node.js', 'SQL', 'AWS',
    'Docker', 'Kubernetes', 'Git', 'TypeScript', 'PHP', 'Ruby', 'C++',
    'Machine Learning', 'AI', 'Data Science', 'Excel', 'Project Management',
    'Agile', 'Scrum', 'Communication', 'Leadership', 'Teamwork'
  ];
  var found = commonSkills.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );
  return found.length > 0 ? found.join(', ') : 'Not specified';
}

// -----------------------------------------------------------------
// Add a custom menu to the Google Sheet for easy access
// -----------------------------------------------------------------
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🤖 Job Automation')
    .addItem('▶️ Fetch Indeed Jobs', 'fetchIndeedJobs')
    .addItem('🔑 Set API Key (Run Once)', 'setApiKey')
    .addToUi();
}