const { Builder, By, Key, until } = require('selenium-webdriver');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

async function scrapeWebsite() {

    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('https://hfr.health.gov.ng/facilities/hospitals-search?_token=HwUY5JtvWKRw3vXigWPminmhVtjAOIMgcnYVCUf7&state_id=104&ward_id=0&facility_level_id=0&ownership_id=0&operational_status_id=1&registration_status_id=0&license_status_id=1&geo_codes=0&service_type=0&service_category_id=0&entries_per_page=20&page=34');

        const keys = [
            'Facility Code',
            'Facility UID',
            'State Unique ID',
            'Registration No',
            'Alternate Name',
            'Start Date',
            'Ownership',
            'Ownership Type',
            'Facility Level',
            'Facility Level Option',
            'Days of Operation',
            'Hours of Operation',
            'State',
            'LGA',
            'Ward',
            'Physical Location',
            'Postal Address',
            'Longitude',
            'Latitude',
            'Phone Number',
            'Alternate Number',
            'Email Address',
            'Website',
            'Operational Status',
            'Registration Status',
            'License Status',
            'Out Patient Services',
            'In Patient Services',
            'Medical Services',
            'Surgical Services',
            'Obsterics and Gynecology Services',
            'Pediatrics Services',
            'Dental Services',
            'Specific Clinical Services',
            'Total number of Beds',
            'Onsite Laboratory',
            'Onsite Imaging',
            'Onsite Pharmacy',
            'Mortuary Services',
            'Ambulance Services',
            'Number of Doctors',
            'Number of Pharmacists',
            'Number Pharmacy Technicians',
            'Number of Dentists',
            'Number of Dental Technicians',
            'Number of Nurses',
            'Number of Midwifes',
            'Number of Nurses/Midwifes',
            'Number of Lab Technicians',
            'Number of Lab Scientits',
            'Health Records/HIM Officers',
            'Number of Community Health Officer',
            'Number of Community Health Extension Worker',
            'Number of Junior Com Health Extension Worker',
            'Number of Environmental Health Officers',
            'Number of Health Attendant/Assistant:'
        ]

        const csvHeader = []

        for (let key of keys) {
            csvHeader.push({
                id: key,
                title: key,
            })
        }


        const csvWriter = createCsvWriter({
            path: 'main-output.csv',
            header: csvHeader,
            append: true
        });

        const btns = await driver.findElements(By.css('table tr td a .btn'))

        const csvRecord = []

        for (let btn of btns) {

            const payload = {
                "Facility Code": await btn.getAttribute('data-unique_id'),
                "Facility UID": await btn.getAttribute('data-id'),
                "State Unique ID": await btn.getAttribute('data-id'),
                "Registration No": await btn.getAttribute('data-registration_no'),
                "Alternate Name": await btn.getAttribute('data-alt_facility_name'),
                "Start Date": await btn.getAttribute('data-start_date'),
                "Ownership": await btn.getAttribute('data-ownership'),
                "Ownership Type": await btn.getAttribute('data-ownership_type'),
                "Facility Level": await btn.getAttribute('data-facility_level'),
                "Facility Level Option": await btn.getAttribute('data-facility_level_option'),
                "Days of Operation": await btn.getAttribute('data-operational_days'),
                "Hours of Operation": await btn.getAttribute('data-operational_hours'),
                "State": await btn.getAttribute('data-state'),
                "LGA": await btn.getAttribute('data-lga'),
                "Ward": await btn.getAttribute('data-ward'),
                "Physical Location": await btn.getAttribute('data-physical_location'),
                "Postal Address": await btn.getAttribute('data-postal_address'),
                "Longitude": await btn.getAttribute('data-longitude'),
                "Latitude": await btn.getAttribute('data-latitude'),
                "Phone Number": await btn.getAttribute('data-phone_number'),
                "Alternate Number": await btn.getAttribute('data-alternate_number'),
                "Email Address": await btn.getAttribute('data-email_address'),
                "Website": await btn.getAttribute('data-website'),
                "Operational Status": await btn.getAttribute('data-operation_status'),
                "Registration Status": await btn.getAttribute('data-registration_status'),
                "License Status": await btn.getAttribute('data-license_status'),
                "Out Patient Services": await btn.getAttribute('data-outpatient'),
                "In Patient Services": await btn.getAttribute('data-inpatient'),
            }

            await btn.click()
            await driver.sleep(2000);

            const medical = await driver.findElement(By.css('#medical'))
            const surgical = await driver.findElement(By.css('#surgical'))
            const gyn = await driver.findElement(By.css('#gyn'))
            const pediatrics = await driver.findElement(By.css('#pediatrics'))
            const dental = await driver.findElement(By.css('#dental'))
            const specialservices = await driver.findElements(By.css('#specialservice .label'))

            const spTexts = []
            for (let sp of specialservices) {
                const spText = await sp.getAttribute('textContent')
                spTexts.push(spText)
            }

            payload["Medical Services"] = await medical.getText()
            payload["Surgical Services"] = await surgical.getText()
            payload["Obsterics and Gynecology Services"] = await gyn.getText()
            payload["Pediatrics Services"] = await pediatrics.getText()
            payload["Dental Services"] = await dental.getText()
            payload["Specific Clinical Services"] = spTexts.join(', ')

            payload["Total number of Beds"] = await btn.getAttribute('data-beds')
            payload["Onsite Laboratory"] = await btn.getAttribute('data-onsite_laboratory')
            payload["Onsite Imaging"] = await btn.getAttribute('data-onsite_imaging')
            payload["Onsite Pharmacy"] = await btn.getAttribute('data-onsite_pharmarcy')
            payload["Mortuary Services"] = await btn.getAttribute('data-mortuary_services')
            payload["Ambulance Services"] = await btn.getAttribute('data-ambulance_services')

            payload["Number of Doctors"] = await btn.getAttribute('data-doctors')
            payload["Number of Pharmacists"] = await btn.getAttribute('data-pharmacists')
            payload["Number Pharmacy Technicians"] = await btn.getAttribute('data-pharmacy_technicians')
            payload["Number of Dentists"] = await btn.getAttribute('data-dentist')
            payload["Number of Dental Technicians"] = await btn.getAttribute('data-dental_technicians')
            payload["Number of Nurses"] = await btn.getAttribute('data-nurses')
            payload["Number of Midwifes"] = await btn.getAttribute('data-midwifes')
            payload["Number of Nurses/Midwifes"] = await btn.getAttribute('data-nurse_midwife')
            payload["Number of Lab Technicians"] = await btn.getAttribute('data-lab_technicians')
            payload["Number of Lab Scientits"] = await btn.getAttribute('data-lab_scientists')
            payload["Health Records/HIM Officers"] = await btn.getAttribute('data-him_officers')
            payload["Number of Community Health Officer"] = await btn.getAttribute('data-community_health_officer')
            payload["Number of Community Health Extension Worker"] = await btn.getAttribute('data-community_extension_workers')
            payload["Number of Junior Com Health Extension Worker"] = await btn.getAttribute('data-jun_community_extension_worker')
            payload["Number of Environmental Health Officers"] = await btn.getAttribute('data-env_health_officers')
            payload["Number of Health Attendant/Assistant:"] = await btn.getAttribute('data-attendants')

            csvRecord.push(payload)

            const closebtn = await driver.findElement(By.css('.modal-footer .btn'))
            await closebtn.click()

        }

        await csvWriter.writeRecords(csvRecord)

        console.log('CSV file created and data written successfully');

    } catch (err) {
        console.log(err)
    }
    finally {
        await driver.quit();
    }
}

scrapeWebsite();
