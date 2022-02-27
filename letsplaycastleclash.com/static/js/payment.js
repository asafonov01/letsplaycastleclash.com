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

    let yoomoney_form = $('.yoomoney_form')
    yoomoney_form.find('input[name="formcomment"]').val(comment)
    yoomoney_form.find('input[name="short-dest"]').val(comment)
    yoomoney_form.find('input[name="label"]').val(comment)
    yoomoney_form.find('input[name="comment"]').val(comment)
    yoomoney_form.find('input[name="paymentType"]').val(paymentType)
    yoomoney_form.find('input[name="sum"]').val(coin_count)
    yoomoney_form.submit()
}


function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}


function submit_qiwi() {
    let coin_count = parseInt($('.coin_count_input').val())
    let tg_id = parseInt($('.tg_id_input').val())

    let comment = `Покупка ${coin_count} CastleCoin пользователем ${tg_id}`

    let qiwi_form = $('.qiwi_form')
    qiwi_form.find('input[name="billId"]').val(create_UUID())
    qiwi_form.find('input[name="comment"]').val(comment)
    qiwi_form.find('input[name="amount"]').val(coin_count)
    qiwi_form.submit()
}

$(document).ready(function () {
    scrollToTargetAdjusted();
    $('.btn-complete').click((e) => {
        if ($('#bank-card').is(':checked'))
            submit_yoomoney('AC')

        if ($('#qiwi').is(':checked'))
            submit_qiwi()

        if ($('#u-money').is(':checked'))
            submit_yoomoney('PC')
    })
});

