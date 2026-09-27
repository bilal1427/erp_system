const validateCustomer = (req) => {
    const { companyName, contactPerson, mobile, email, city } = req.body;

    const errors = [];

    if (!companyName || companyName.trim() === "") {
        errors.push("Company name is required");
    }

    if (!contactPerson || contactPerson.trim() === "") {
        errors.push("Contact person is required");
    }

    if (!mobile || mobile.trim() === "") {
        errors.push("Mobile is required");
    } else if (!/^[0-9]{10}$/.test(mobile)) {
        errors.push("Mobile must be a valid 10-digit number");
    }

    if (!email || email.trim() === "") {
        errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push("Email must be valid");
    }

    if (!city || city.trim() === "") {
        errors.push("City is required");
    }

    return errors;
};

module.exports = {
    validateCustomer
};