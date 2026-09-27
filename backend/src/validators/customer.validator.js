const validateCustomer = (req) => {
    const body = req.body || {};
    const companyName = body.companyName ?? body.company_name;
    const contactPerson = body.contactPerson ?? body.contact_person;
    const { mobile, email, city } = body;

    const errors = [];

    if (typeof companyName !== "string" || companyName.trim() === "") {
        errors.push("Company name is required");
    }

    if (typeof contactPerson !== "string" || contactPerson.trim() === "") {
        errors.push("Contact person is required");
    }

    if (typeof mobile !== "string" || mobile.trim() === "") {
        errors.push("Mobile is required");
    } else if (!/^[0-9]{10,15}$/.test(String(mobile).trim())) {
        errors.push("Mobile must be a valid number (10-15 digits)");
    }

    if (email !== undefined && email !== null && email !== "") {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push("Email must be valid");
        }
    }

    return errors;
};

module.exports = { validateCustomer };
