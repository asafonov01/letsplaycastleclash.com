function scrollToTargetAdjusted() {
    const element = document.getElementsByClassName('content_box')[0];
    const headerOffset = document.getElementsByTagName("header")[0].getBoundingClientRect().height;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
    });
}


function submit_yoomoney(paymentType) {
    let coin_count = parseInt($('.coin_count_input').val())
    let tg_id = parseInt($('.tg_id_input').val())

    let comment = `Покупка ${coin_count} CastleCoin пользователем ${tg_id}`
    let label = tg_id
    if (window.promo_code) {
        comment = `Покупка ${coin_count} CastleCoin c промокодом ${promo_code} пользователем ${tg_id}`
        label = `${promo_code}:${tg_id}`
    }


    let yoomoney_form = $('.yoomoney_form')
    yoomoney_form.find('input[name="formcomment"]').val(comment)
    yoomoney_form.find('input[name="short-dest"]').val(comment)
    yoomoney_form.find('input[name="targets"]').val(comment)
    yoomoney_form.find('input[name="label"]').val(label)
    yoomoney_form.find('input[name="comment"]').val(comment)
    yoomoney_form.find('input[name="paymentType"]').val(paymentType)
    yoomoney_form.find('input[name="sum"]').val(window.paymentSum)
    yoomoney_form.submit()
}


function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}


function submit_qiwi() {
    let coin_count = parseInt($('.coin_count_input').val())
    let tg_id = parseInt($('.tg_id_input').val())

    let comment = `Покупка ${coin_count} CastleCoin пользователем ${tg_id}`

    if (window.promo_code) {
        comment = `Покупка ${coin_count} CastleCoin c промокодом ${promo_code} пользователем ${tg_id}`
    }


    let qiwi_form = $('.qiwi_form')
    qiwi_form.find('input[name="billId"]').val(create_UUID())
    qiwi_form.find('input[name="comment"]').val(comment)
    qiwi_form.find('input[name="amount"]').val(window.paymentSum)
    qiwi_form.submit()
}


function submit_monobank() {
    let coin_count = parseInt($('.coin_count_input').val())
    let tg_id = parseInt($('.tg_id_input').val())

    let comment = `Покупка ${coin_count} CastleCoin пользователем ${tg_id}`

    if (window.promo_code) {
        comment = `Покупка ${coin_count} CastleCoin c промокодом ${promo_code} пользователем ${tg_id}`
    }

    window.location.replace(`https://mbnk.app/pay/4hXhxGpJrw?a=${(window.paymentSum / 3.7).toFixed(2)}&t=${encodeURIComponent(comment)}`);

}


function updatePaymentSum() {
    let payment_sum_input = $('.payment_sum_input');
    let coin_count_input = $('.coin_count_input')
    let promo_input = $('.promo_input');


    let promo_code = promo_input.val()
    let coin_count = parseInt(coin_count_input.val())
    $.get("https://letsplaycastleclash.com/promo/" + encodeURIComponent(promo_code), function (data) {
    }).always(function (data) {
        var paymentSum = coin_count
        if ('sale' in data) {
            window.promo_code = promo_code
            paymentSum = coin_count - Math.floor(coin_count * data["sale"] / 100.0)
        }
        payment_sum_input.val(paymentSum)
        window.paymentSum = paymentSum
    })
}

$(document).ready(function () {
    scrollToTargetAdjusted();
    let promo_input = $('.promo_input');
    let coin_count_input = $('.coin_count_input');
    let payment_sum_input = $('.payment_sum_input');
    let coin_count = parseInt(coin_count_input.val());
    payment_sum_input.val(coin_count);
    window.paymentSum = coin_count

    promo_input.on('input', function (e) {
        updatePaymentSum();
    });

    coin_count_input.on('input', function (e) {
        updatePaymentSum();
    });

    $('.btn-complete').click((e) => {
        if ($('#bank-card').is(':checked'))
            submit_yoomoney('AC')

        if ($('#qiwi').is(':checked'))
            submit_qiwi()

        if ($('#monobank').is(':checked'))
            submit_monobank()


        if ($('#u-money').is(':checked'))
            submit_yoomoney('PC')
    })
});

