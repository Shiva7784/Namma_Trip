const TpackageValidation = (
    packageId,
    package_Title,
    pCreateDate,
    packagePrice,
    pDestination,
    pDays,
    isChecked
  ) => {
    const errors = {};

    const tPackageIDpattern = /^CO\d{4}$/;
    const tPackageTitlepattern = /^.{10,}$/;
    const tPackageCreateDatepattern = new Date().toISOString().split('T')[0];
    const tPackagePricepattern = parseFloat(packagePrice);
    const tPackageDestinationpattern = /^[A-Za-z]+(?:[\s,]+[A-Za-z]+)*$/;
    const tPackageDayspattern = parseFloat(pDays);
    
    if (!tPackageIDpattern.test(packageId)) {
        errors.packageId = "Tour Package ID must be in the format COxxxx.";
    }

    if (!tPackageTitlepattern.test(package_Title)) {
        errors.package_Title = "Tour Package Title must be at least 10 letters.";
    }

    if (tPackageCreateDatepattern !== pCreateDate) {
        errors.pCreateDate = "Tour Package Create Date must be today's date";
    }

    if (isNaN(tPackagePricepattern) || tPackagePricepattern <= 0) {
        errors.packagePrice = "Tour Package Price must be a positive price.";
    }

    if (!tPackageDestinationpattern.test(pDestination)) {
        errors.pDestination = "Tour Package Destination must be at least 2 words.";
    }

    if (![3, 5, 7].includes(tPackageDayspattern) && tPackageDayspattern <= 7) {
        errors.pDays ="Tour Package Days must be 3, 5, 7, or more than 7.";
    }

    if (!isChecked) {
        errors.isChecked = 'You must agree with the terms';
    }

    return errors;

}
export default TpackageValidation;