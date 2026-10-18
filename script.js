/**
 * Lab 8: Cross-Page User Information Capture
 * Form Validation, Progress Tracking & Cross-Page State Handling
 * With Dynamic Cascading Location (Country -> State -> City)
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('userForm');
  const btnDemo = document.getElementById('btnDemo');
  const btnReset = document.getElementById('btnReset');
  const progressBar = document.getElementById('progressBar');
  const progressPercent = document.getElementById('progressPercent');

  // Input Elements
  const fullNameInput = document.getElementById('fullName');
  const genderInputs = document.querySelectorAll('input[name="gender"]');
  const countryCodeSelect = document.getElementById('countryCode');
  const mobileInput = document.getElementById('mobile');
  const emailInput = document.getElementById('email');
  
  // Location Elements
  const countrySelect = document.getElementById('country');
  const stateSelect = document.getElementById('state');
  const customStateInput = document.getElementById('customState');
  const citySelect = document.getElementById('city');
  const customCityInput = document.getElementById('customCity');

  // Cascading Location Dataset (Country -> State -> Cities)
  const locationHierarchy = {
    "India": {
      "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi"],
      "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane"],
      "Delhi": ["New Delhi", "North Delhi", "South Delhi", "Dwarka"],
      "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
      "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
      "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
      "Uttar Pradesh": ["Lucknow", "Noida", "Kanpur", "Varanasi", "Agra"],
      "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri"],
      "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"],
      "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota"]
    },
    "United States": {
      "California": ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento"],
      "New York": ["New York City", "Buffalo", "Rochester", "Albany"],
      "Texas": ["Houston", "Austin", "Dallas", "San Antonio", "Fort Worth"],
      "Washington": ["Seattle", "Bellevue", "Spokane", "Tacoma"],
      "Florida": ["Miami", "Orlando", "Tampa", "Jacksonville"]
    },
    "United Kingdom": {
      "England": ["London", "Manchester", "Birmingham", "Leeds", "Liverpool"],
      "Scotland": ["Edinburgh", "Glasgow", "Aberdeen", "Dundee"],
      "Wales": ["Cardiff", "Swansea", "Newport"]
    },
    "Canada": {
      "Ontario": ["Toronto", "Ottawa", "Mississauga", "Hamilton"],
      "British Columbia": ["Vancouver", "Victoria", "Surrey", "Burnaby"],
      "Quebec": ["Montreal", "Quebec City", "Laval"]
    },
    "Australia": {
      "New South Wales": ["Sydney", "Newcastle", "Wollongong"],
      "Victoria": ["Melbourne", "Geelong", "Ballarat"],
      "Queensland": ["Brisbane", "Gold Coast", "Cairns"]
    },
    "United Arab Emirates": {
      "Dubai": ["Dubai City", "Deira", "Jumeirah", "Downtown"],
      "Abu Dhabi": ["Abu Dhabi City", "Al Ain"],
      "Sharjah": ["Sharjah City", "Khor Fakkan"]
    },
    "Germany": {
      "Bavaria": ["Munich", "Nuremberg", "Augsburg"],
      "Berlin": ["Berlin City"],
      "Hesse": ["Frankfurt", "Wiesbaden"]
    },
    "France": {
      "Île-de-France": ["Paris", "Boulogne-Billancourt", "Saint-Denis"],
      "Provence-Alpes-Côte d'Azur": ["Marseille", "Nice", "Cannes"]
    },
    "Singapore": {
      "Central Region": ["Downtown Core", "Marina Bay", "Orchard"],
      "Jurong": ["Jurong East", "Jurong West"]
    },
    "Japan": {
      "Tokyo": ["Shinjuku", "Shibuya", "Ginza", "Chiyoda"],
      "Osaka": ["Osaka City", "Sakai"],
      "Kyoto": ["Kyoto City"]
    }
  };

  /**
   * Helper: Get effective state value (handles 'Other')
   */
  function getEffectiveState() {
    if (stateSelect.value === 'Other') {
      return customStateInput.value.trim();
    }
    return stateSelect.value;
  }

  /**
   * Helper: Get effective city value (handles 'Other')
   */
  function getEffectiveCity() {
    if (citySelect.value === 'Other') {
      return customCityInput.value.trim();
    }
    return citySelect.value;
  }

  // Validation Rules
  const validators = {
    fullName: (val) => /^[a-zA-Z\s'.]{3,50}$/.test(val.trim()),
    gender: () => document.querySelector('input[name="gender"]:checked') !== null,
    mobile: (val) => {
      const clean = val.replace(/[\s\-()]/g, '');
      return /^\d{10}$/.test(clean); // standard 10-digit mobile number
    },
    email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val.trim().toLowerCase()),
    country: (val) => Boolean(val && val.trim() !== ''),
    state: () => {
      if (!stateSelect.value) return false;
      if (stateSelect.value === 'Other') {
        return customStateInput.value.trim().length >= 2;
      }
      return true;
    },
    city: () => {
      if (!citySelect.value) return false;
      if (citySelect.value === 'Other') {
        return customCityInput.value.trim().length >= 2;
      }
      return true;
    }
  };

  /**
   * Set field visual validation status
   */
  function setFieldStatus(groupId, isValid) {
    const group = document.getElementById(groupId);
    if (!group) return;

    if (isValid === true) {
      group.classList.remove('has-error');
      group.classList.add('is-valid');
    } else if (isValid === false) {
      group.classList.remove('is-valid');
      group.classList.add('has-error');
    } else {
      group.classList.remove('is-valid', 'has-error');
    }
  }

  /**
   * Validate a specific field
   */
  function validateField(fieldName, isBlur = false) {
    let isValid = false;

    switch (fieldName) {
      case 'fullName':
        isValid = validators.fullName(fullNameInput.value);
        if (isBlur || fullNameInput.value.length > 0) {
          setFieldStatus('group-fullName', isValid);
        }
        break;

      case 'gender':
        isValid = validators.gender();
        setFieldStatus('group-gender', isValid);
        break;

      case 'mobile':
        isValid = validators.mobile(mobileInput.value);
        if (isBlur || mobileInput.value.length >= 10) {
          setFieldStatus('group-mobile', isValid);
        }
        break;

      case 'email':
        isValid = validators.email(emailInput.value);
        if (isBlur || (emailInput.value.includes('@') && emailInput.value.includes('.'))) {
          setFieldStatus('group-email', isValid);
        }
        break;

      case 'country':
        isValid = validators.country(countrySelect.value);
        setFieldStatus('group-country', isValid);
        break;

      case 'state':
        isValid = validators.state();
        if (isBlur || stateSelect.value !== '') {
          setFieldStatus('group-state', isValid);
        }
        break;

      case 'city':
        isValid = validators.city();
        if (isBlur || citySelect.value !== '') {
          setFieldStatus('group-city', isValid);
        }
        break;
    }

    updateProgress();
    return isValid;
  }

  /**
   * Update Form Progress Bar
   */
  function updateProgress() {
    let completedCount = 0;
    const totalFields = 7;

    if (validators.fullName(fullNameInput.value)) completedCount++;
    if (validators.gender()) completedCount++;
    if (validators.mobile(mobileInput.value)) completedCount++;
    if (validators.email(emailInput.value)) completedCount++;
    if (validators.country(countrySelect.value)) completedCount++;
    if (validators.state()) completedCount++;
    if (validators.city()) completedCount++;

    const percent = Math.round((completedCount / totalFields) * 100);
    progressBar.style.width = `${percent}%`;
    progressPercent.textContent = `${percent}%`;
  }

  /**
   * Populate States based on Country
   */
  function updateStatesForCountry(countryName) {
    stateSelect.innerHTML = '<option value="" disabled selected>Select State</option>';
    
    if (locationHierarchy[countryName]) {
      const states = Object.keys(locationHierarchy[countryName]);
      states.forEach(st => {
        const opt = document.createElement('option');
        opt.value = st;
        opt.textContent = st;
        stateSelect.appendChild(opt);
      });
    } else {
      // Default global states
      const defaults = ["Karnataka", "Maharashtra", "Delhi", "Tamil Nadu", "California", "New York", "Texas", "England", "Ontario", "New South Wales", "Dubai"];
      defaults.forEach(st => {
        const opt = document.createElement('option');
        opt.value = st;
        opt.textContent = st;
        stateSelect.appendChild(opt);
      });
    }

    // Always include Other
    const otherOpt = document.createElement('option');
    otherOpt.value = 'Other';
    otherOpt.textContent = 'Other (Custom State)';
    stateSelect.appendChild(otherOpt);

    // Reset custom state input
    customStateInput.style.display = 'none';
    customStateInput.value = '';

    // Reset city select
    citySelect.innerHTML = '<option value="" disabled selected>Select State first</option>';
    customCityInput.style.display = 'none';
    customCityInput.value = '';
  }

  /**
   * Populate Cities based on State
   */
  function updateCitiesForState(countryName, stateName) {
    citySelect.innerHTML = '<option value="" disabled selected>Select City</option>';

    if (locationHierarchy[countryName] && locationHierarchy[countryName][stateName]) {
      const cities = locationHierarchy[countryName][stateName];
      cities.forEach(ct => {
        const opt = document.createElement('option');
        opt.value = ct;
        opt.textContent = ct;
        citySelect.appendChild(opt);
      });
    } else {
      // Default cities fallback
      const defaults = ["Bengaluru", "Mumbai", "New Delhi", "Chennai", "Hyderabad", "Pune", "Los Angeles", "New York City", "London", "Toronto", "Sydney", "Dubai City"];
      defaults.forEach(ct => {
        const opt = document.createElement('option');
        opt.value = ct;
        opt.textContent = ct;
        citySelect.appendChild(opt);
      });
    }

    // Always include Other
    const otherOpt = document.createElement('option');
    otherOpt.value = 'Other';
    otherOpt.textContent = 'Other (Custom City)';
    citySelect.appendChild(otherOpt);

    // Reset custom city input
    customCityInput.style.display = 'none';
    customCityInput.value = '';
  }

  // Country Change Listener -> Triggers State Population
  countrySelect.addEventListener('change', () => {
    const selectedCountry = countrySelect.value;
    updateStatesForCountry(selectedCountry);
    validateField('country');
    validateField('state');
    validateField('city');
  });

  // State Change Listener -> Triggers City Population & Custom input display
  stateSelect.addEventListener('change', () => {
    const selectedState = stateSelect.value;
    if (selectedState === 'Other') {
      customStateInput.style.display = 'block';
      customStateInput.focus();
    } else {
      customStateInput.style.display = 'none';
      customStateInput.value = '';
    }

    const selectedCountry = countrySelect.value;
    updateCitiesForState(selectedCountry, selectedState);
    validateField('state');
    validateField('city');
  });

  customStateInput.addEventListener('input', () => validateField('state'));

  // City Change Listener -> Custom input display
  citySelect.addEventListener('change', () => {
    const selectedCity = citySelect.value;
    if (selectedCity === 'Other') {
      customCityInput.style.display = 'block';
      customCityInput.focus();
    } else {
      customCityInput.style.display = 'none';
      customCityInput.value = '';
    }
    validateField('city');
  });

  customCityInput.addEventListener('input', () => validateField('city'));

  // Format mobile phone number cleanly as typed
  mobileInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, ''); // strip non-digits
    if (val.length > 10) val = val.slice(0, 10);
    
    // Auto format 5 digits + space + 5 digits
    if (val.length > 5) {
      e.target.value = `${val.slice(0, 5)} ${val.slice(5)}`;
    } else {
      e.target.value = val;
    }
    validateField('mobile');
  });

  // Attach event listeners for real-time validation
  fullNameInput.addEventListener('input', () => validateField('fullName'));
  fullNameInput.addEventListener('blur', () => validateField('fullName', true));

  genderInputs.forEach(radio => {
    radio.addEventListener('change', () => validateField('gender'));
  });

  mobileInput.addEventListener('blur', () => validateField('mobile', true));

  emailInput.addEventListener('input', () => validateField('email'));
  emailInput.addEventListener('blur', () => validateField('email', true));

  /**
   * Pre-fill form if editing or requested via query params or storage
   */
  function checkPrefill() {
    const urlParams = new URLSearchParams(window.location.search);
    const isEdit = urlParams.get('edit') === 'true';

    let savedData = null;
    try {
      savedData = JSON.parse(sessionStorage.getItem('capturedUserData')) ||
                  JSON.parse(localStorage.getItem('capturedUserData'));
    } catch (e) {
      console.warn('Storage read failed:', e);
    }

    if (isEdit && savedData) {
      fullNameInput.value = savedData.fullName || '';
      if (savedData.gender) {
        const targetRadio = document.querySelector(`input[name="gender"][value="${savedData.gender}"]`);
        if (targetRadio) targetRadio.checked = true;
      }
      if (savedData.countryCode) countryCodeSelect.value = savedData.countryCode;
      mobileInput.value = savedData.mobile || '';
      emailInput.value = savedData.email || '';
      
      // Handle Location prefill
      if (savedData.country) {
        countrySelect.value = savedData.country;
        updateStatesForCountry(savedData.country);
      }

      if (savedData.state) {
        let stateOption = Array.from(stateSelect.options).find(o => o.value === savedData.state);
        if (stateOption) {
          stateSelect.value = savedData.state;
        } else {
          stateSelect.value = 'Other';
          customStateInput.style.display = 'block';
          customStateInput.value = savedData.state;
        }
        updateCitiesForState(savedData.country, savedData.state);
      }

      if (savedData.city) {
        let cityOption = Array.from(citySelect.options).find(o => o.value === savedData.city);
        if (cityOption) {
          citySelect.value = savedData.city;
        } else {
          citySelect.value = 'Other';
          customCityInput.style.display = 'block';
          customCityInput.value = savedData.city;
        }
      }

      // Validate all
      ['fullName', 'gender', 'mobile', 'email', 'country', 'state', 'city'].forEach(field => validateField(field));
      showToast('Loaded your existing profile for editing.', 'info');
    }
  }

  /**
   * Fill realistic Demo Data
   */
  btnDemo.addEventListener('click', () => {
    fullNameInput.value = 'Dr. Priya Sharma';
    const femaleRadio = document.querySelector('input[name="gender"][value="Female"]');
    if (femaleRadio) femaleRadio.checked = true;
    countryCodeSelect.value = '+91';
    mobileInput.value = '98450 12345';
    emailInput.value = 'priya.sharma@example.ac.in';
    
    // Cascading Location Demo
    countrySelect.value = 'India';
    updateStatesForCountry('India');
    stateSelect.value = 'Karnataka';
    updateCitiesForState('India', 'Karnataka');
    citySelect.value = 'Bengaluru';

    ['fullName', 'gender', 'mobile', 'email', 'country', 'state', 'city'].forEach(field => validateField(field, true));
    showToast('Sample user information loaded successfully!', 'success');
  });

  /**
   * Reset Form & validation classes
   */
  btnReset.addEventListener('click', () => {
    setTimeout(() => {
      customStateInput.style.display = 'none';
      customStateInput.value = '';
      customCityInput.style.display = 'none';
      customCityInput.value = '';

      ['group-fullName', 'group-gender', 'group-mobile', 'group-email', 'group-country', 'group-state', 'group-city']
        .forEach(id => setFieldStatus(id, null));
      updateProgress();
      showToast('Form cleared.', 'info');
    }, 50);
  });

  /**
   * Submit Handler
   */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate each field
    const isNameValid = validateField('fullName', true);
    const isGenderValid = validateField('gender', true);
    const isMobileValid = validateField('mobile', true);
    const isEmailValid = validateField('email', true);
    const isCountryValid = validateField('country', true);
    const isStateValid = validateField('state', true);
    const isCityValid = validateField('city', true);

    const isAllValid = isNameValid && isGenderValid && isMobileValid && isEmailValid && isCountryValid && isStateValid && isCityValid;

    if (!isAllValid) {
      showToast('Please correct highlighted fields before submitting.', 'error');

      // Scroll to first error
      const firstError = document.querySelector('.form-group.has-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const input = firstError.querySelector('input, select');
        if (input) input.focus();
      }
      return;
    }

    // Prepare payload
    const selectedGender = document.querySelector('input[name="gender"]:checked').value;
    const cleanMobile = mobileInput.value.trim();
    const finalState = getEffectiveState();
    const finalCity = getEffectiveCity();

    const userData = {
      id: 'USR-' + Date.now().toString(36).toUpperCase(),
      fullName: fullNameInput.value.trim(),
      gender: selectedGender,
      countryCode: countryCodeSelect.value,
      mobile: cleanMobile,
      fullMobile: `${countryCodeSelect.value} ${cleanMobile}`,
      email: emailInput.value.trim().toLowerCase(),
      country: countrySelect.value,
      state: finalState,
      city: finalCity,
      submittedAt: new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    };

    // 1. Save to sessionStorage and localStorage for state persistence
    try {
      sessionStorage.setItem('capturedUserData', JSON.stringify(userData));
      localStorage.setItem('capturedUserData', JSON.stringify(userData));

      // Append to history list in localStorage
      let history = [];
      try {
        history = JSON.parse(localStorage.getItem('userSubmissionsHistory')) || [];
      } catch (err) {
        history = [];
      }
      history.unshift(userData); // latest first
      // Keep up to 20 records
      if (history.length > 20) history = history.slice(0, 20);
      localStorage.setItem('userSubmissionsHistory', JSON.stringify(history));
    } catch (storageErr) {
      console.warn('Storage write failed or blocked:', storageErr);
    }

    // 2. Prepare URL Query Parameters as a cross-page fallback
    const queryParams = new URLSearchParams({
      id: userData.id,
      fullName: userData.fullName,
      gender: userData.gender,
      countryCode: userData.countryCode,
      mobile: userData.mobile,
      email: userData.email,
      country: userData.country,
      state: userData.state,
      city: userData.city,
      submittedAt: userData.submittedAt
    });

    // Provide visual feedback button state
    const submitBtn = document.getElementById('btnSubmit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="2" x2="12" y2="6"></line>
        <line x1="12" y1="18" x2="12" y2="22"></line>
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
        <line x1="2" y1="12" x2="6" y2="12"></line>
        <line x1="18" y1="12" x2="22" y2="12"></line>
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
      </svg>
      <span>Processing...</span>
    `;

    showToast('Data captured successfully! Redirecting...', 'success');

    // Smooth navigation to display.html
    setTimeout(() => {
      window.location.href = `display.html?${queryParams.toString()}`;
    }, 600);
  });

  /**
   * Toast helper
   */
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✓';
    if (type === 'error') icon = '✕';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Check prefill if returned from display edit
  checkPrefill();
});
