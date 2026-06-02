const UpdateValidations = (values) => {
    const errors = {};

    const tPackageTitlepattern = /^.{10,}$/;
    const tPackagePricepattern = parseFloat(values.packagePrice);
    const tPackageDestinationpattern = /^[A-Za-z]+(?:[\s,]+[A-Za-z]+)*$/;
    const tPackageDayspattern = parseFloat(values.pDays);

    if (!tPackageTitlepattern.test(values.package_Title)) {
        errors.package_Title = "Tour Package Title must be at least 10 letters.";
    }

    if (isNaN(tPackagePricepattern) || tPackagePricepattern <= 0) {
        errors.packagePrice = "Tour Package Price must be a positive price.";
    }

    if (!tPackageDestinationpattern.test(values.pDestination)) {
        errors.pDestination = "Tour Package Destination must be at least 2 words.";
    }

    if (![3, 5, 7].includes(tPackageDayspattern) && tPackageDayspattern <= 7) {
        errors.pDays ="Tour Package Days must be 3, 5, 7, or more than 7.";
    }

    if (!values.isChecked) {
        errors.isChecked = 'Confirm that the package details are accurate';
    }

    return errors;

}
export default UpdateValidations;
