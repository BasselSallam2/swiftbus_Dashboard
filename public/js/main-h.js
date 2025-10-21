

    document.addEventListener("DOMContentLoaded", function () {
        const oneWay = document.getElementById("oneWay");
        const roundTrip = document.getElementById("roundTrip");
        const returnDate = document.getElementById("to");

        // Event listener for radio buttons
        oneWay.addEventListener("change", function () {
            if (oneWay.checked) {
                returnDate.disabled = true;
            }
        });

        roundTrip.addEventListener("change", function () {
            if (roundTrip.checked) {
                returnDate.disabled = false;
            }
        });
    });

    // var buttonPlus = $(".qty-btn-plus");
    // var buttonMinus = $(".qty-btn-minus");

    // var incrementPlus = buttonPlus.click(function () {
    //     var $n = $(this)
    //         .parent(".qty-container")
    //         .find(".input-qty");
    //     $n.val(Number($n.val()) + 1);
    // });

    // var incrementMinus = buttonMinus.click(function () {
    //     var $n = $(this)
    //         .parent(".qty-container")
    //         .find(".input-qty");
    //     var amount = Number($n.val());
    //     if (amount > 1) {
    //         $n.val(amount - 1);
    //     }
    // });


    document.getElementById('btn-one').addEventListener('click', function () {
        document.getElementById('stepone').style.display = 'none';
        document.getElementById('steptwo').style.display = 'block';
    });


    document.getElementById('btn-two').addEventListener('click', function () {
        document.getElementById('steptwo').style.display = 'none';
        document.getElementById('stepthree').style.display = 'block';
    });

    $(document).ready(function () {
        $("input.action").change(function () {
            var test = $(this).val();
            $(".show-hide").hide();
            $("#" + test).show();
            checkForm();
        });

        $(".form-control").on("input", function () {
            checkForm();
        });

        function checkForm() {
            var isFormValid = true;
            var visibleSection = $(".show-hide:visible");

            visibleSection.find(".form-control").each(function () {
                if ($(this).val().trim() === "") {
                    isFormValid = false;
                    return false;
                }
            });

            $(".btn").prop("disabled", !isFormValid);
        }
    });


    // Price-h
    document.addEventListener('DOMContentLoaded', () => {
        const selectedQty = parseInt(localStorage.getItem('selectedQty')) || 1;
        const checkboxesGroup1 = document.querySelectorAll('.chair-h input[type="checkbox"][name="radio"]');
        const checkboxesGroup2 = document.querySelectorAll('.chair-h input[type="checkbox"][name="radio2"]');
        const totalPriceElement = document.getElementById('totalPrice');

        let selectedChairs = [];

        function updateTotalPrice() {
            let totalPrice = 0;

            // حساب السعر بناءً على جميع العناصر المحددة
            document.querySelectorAll('.chair-h input[type="checkbox"]:checked').forEach(input => {
                totalPrice += parseFloat(input.getAttribute('data-price'));
            });

            totalPriceElement.textContent = `${totalPrice.toFixed(2)} EGP`;
        }

        function handleSelection(event) {
            const checkbox = event.target;

            if (checkbox.checked) {
                selectedChairs.push(checkbox);
            } else {
                selectedChairs = selectedChairs.filter(item => item !== checkbox);
            }

            // إذا تجاوز العدد المطلوب، يتم إلغاء تحديد الأقدم
            if (selectedChairs.length > selectedQty) {
                const removedChair = selectedChairs.shift();
                removedChair.checked = false;
            }

            updateTotalPrice();
        }

        // تطبيق الـ Event Listener على جميع الكراسي في المجموعتين
        [...checkboxesGroup1, ...checkboxesGroup2].forEach(input => {
            input.addEventListener('change', handleSelection);
        });

        // تحديث السعر عند تحميل الصفحة
        updateTotalPrice();
    });
    document.addEventListener('DOMContentLoaded', () => {
        const selectedQty = parseInt(localStorage.getItem('selectedQty')) || 1;

        // تحديد عناصر المجموعة الأولى
        const checkboxesGroup1 = document.querySelectorAll('.booking-bus-1 .chair-h input[type="checkbox"]');
        const totalPriceElementGroup1 = document.getElementById('totalPriceGroup1');
        let selectedChairsGroup1 = [];

        // تحديد عناصر المجموعة الثانية
        const checkboxesGroup2 = document.querySelectorAll('.booking-bus-2 .chair-h input[type="checkbox"]');
        const totalPriceElementGroup2 = document.getElementById('totalPriceGroup2');
        let selectedChairsGroup2 = [];

        // العنصر الذي سيتم عرض السعر الإجمالي فيه
        const totalPathElement = document.getElementById('totalPath');

        // دالة لتحديث السعر الإجمالي لكل مجموعة
        function updateTotalPrice(selectedChairs, totalPriceElement) {
            let totalPrice = 0;

            // حساب السعر بناءً على العناصر المحددة في المجموعة
            selectedChairs.forEach(checkbox => {
                totalPrice += parseFloat(checkbox.getAttribute('data-price'));
            });

            totalPriceElement.textContent = `${totalPrice.toFixed(2)} EGP`;
            updateTotalPath(); // تحديث السعر الإجمالي للمجموعتين
        }

        // دالة لتحديث السعر الإجمالي للمجموعتين
        function updateTotalPath() {
            const totalPriceGroup1 = parseFloat(totalPriceElementGroup1.textContent) || 0;
            const totalPriceGroup2 = parseFloat(totalPriceElementGroup2.textContent) || 0;
            const totalPrice = totalPriceGroup1 + totalPriceGroup2;

            totalPathElement.textContent = `${totalPrice.toFixed(2)} EGP`;
        }

        // دالة لإدارة التحديد في كل مجموعة
        function handleSelection(event, selectedChairs, totalPriceElement) {
            const checkbox = event.target;
            const chairElement = checkbox.closest('.chair-h'); // الحصول على العنصر الأب (chair-h)

            if (checkbox.checked) {
                selectedChairs.push(checkbox);
                chairElement.classList.add('selected'); // إضافة الكلاس "selected"
            } else {
                const index = selectedChairs.indexOf(checkbox);
                if (index !== -1) {
                    selectedChairs.splice(index, 1); // إزالة العنصر من المصفوفة
                    chairElement.classList.remove('selected'); // إزالة الكلاس "selected"
                }
            }

            // إذا تجاوز العدد المطلوب، يتم إلغاء تحديد الأقدم
            if (selectedChairs.length > selectedQty) {
                const removedChair = selectedChairs.shift();
                removedChair.checked = false;
                removedChair.closest('.chair-h').classList.remove('selected'); // إزالة الكلاس "selected"
            }

            updateTotalPrice(selectedChairs, totalPriceElement); // تحديث السعر الإجمالي للمجموعة
        }

        // تطبيق الـ Event Listener على جميع الكراسي في المجموعة الأولى
        checkboxesGroup1.forEach(input => {
            input.addEventListener('change', (event) => handleSelection(event, selectedChairsGroup1, totalPriceElementGroup1));
        });

        // تطبيق الـ Event Listener على جميع الكراسي في المجموعة الثانية
        checkboxesGroup2.forEach(input => {
            input.addEventListener('change', (event) => handleSelection(event, selectedChairsGroup2, totalPriceElementGroup2));
        });

        // تحديث السعر عند تحميل الصفحة
        updateTotalPrice(selectedChairsGroup1, totalPriceElementGroup1);
        updateTotalPrice(selectedChairsGroup2, totalPriceElementGroup2);
    });