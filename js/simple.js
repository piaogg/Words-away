var wordsAway = new WordsAway();

$('.start-mixin').click(function () {
    var text = $('#textin').val();
    var mixin = '\u200b';
    var beforeMark = '\ue0dc',
        afterMark = '\ue0dd';
    var missBrackets = $('#miss-brackets')[0].checked,
        coolapkMode = $('#coolapk-mode')[0].checked;
    var marked = '\ue0dc$1\ue0dd';
    text = (missBrackets) ?
        text.replace(/(http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?)/g, marked) :
        text;
    text = (coolapkMode) ?
        text.replace(/(#[\w\u4e00-\u9fa5]{1,20}#)/g, marked) :
        text;
        
    text = ($('#rows-reverse')[0].checked) ?
        wordsAway.rowsReverse(text, missBrackets) :
        text;
    text = ($('#words-reverse')[0].checked) ?
        wordsAway.wordsReverse(text, missBrackets) :
        text;
    text = ($('#zero-width-space')[0].checked) ?
        wordsAway.mixin(text, mixin, missBrackets) :
        text;
    text = ($('#vertical-text')[0].checked) ?
        wordsAway.verticalText(text, parseInt($('#max-col').val()), parseInt($('#min-row').val())) :
        text;
    text = ($('#fake-normal')[0].checked) ?
        wordsAway.sameShape(text, missBrackets) :
        text;
    text = (missBrackets) ?
        text.replace(/\ue0dc(http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?)\ue0dd/g, '$1') :
        text;

    var setText = () => {
        $('pre.result').text(text);
        $('.to-copy').attr('data-clipboard-text', text);
    }

    if ($('#shorten-url')[0].checked) {
        var urls = text.match(/(http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?)/g);
        $('pre.result').text('短链接请求中...');
        urls || setText();
        for (let i in urls) {
            $.get('https://is.gd/create.php', {
                'url': urls[i],
                'format': 'json'
            }, (data) => {
                text = text.replace(urls[i], data['shorturl']);
                if (i == urls.length - 1) {
                    setText();
                }
            }, 'jsonp').fail(() => {
                M.toast('短链接请求失败');
                setText();
            });
        }
    } else {
        setText();
    }
});

$('#miss-brackets').click(function () {
    if ($(this)[0].checked) {
        $('#vertical-text')[0].checked = false;
        $('#shorten-url').removeAttr('disabled');
    } else {
        $('#shorten-url').attr('disabled', 'disabled')[0].checked = false;
    }
});
$('#rows-reverse').click(function () {
    if ($(this)[0].checked) {
        $('#words-reverse')[0].checked = false;
        $('#vertical-text')[0].checked = false;
    }
});
$('#words-reverse').click(function () {
    if ($(this)[0].checked) {
        $('#rows-reverse')[0].checked = false;
        $('#zero-width-space')[0].checked = false;
        $('#vertical-text')[0].checked = false;
    }
});
$('#zero-width-space').click(function () {
    if ($(this)[0].checked) {
        $('#words-reverse')[0].checked = false;
        $('#vertical-text')[0].checked = false;
    }
});
$('#vertical-text').click(function () {
    if ($(this)[0].checked) {
        $('#rows-reverse').attr('disabled', 'disabled')[0].checked = false;
        $('#zero-width-space').attr('disabled', 'disabled')[0].checked = false;
        $('#words-reverse').attr('disabled', 'disabled')[0].checked = false;
        $('#miss-brackets').attr('disabled', 'disabled')[0].checked = false;
        $('#shorten-url').attr('disabled', 'disabled')[0].checked = false;
        $('.input-field.hidden').css('display', 'inline-block');
    } else {
        $('#rows-reverse').removeAttr('disabled');
        $('#zero-width-space').removeAttr('disabled')[0].checked = true;
        $('#words-reverse').removeAttr('disabled');
        $('#miss-brackets').removeAttr('disabled')[0].checked = true;
        $('#shorten-url').removeAttr('disabled');
        $('.input-field.hidden').css('display', 'none');
    }
});

new ClipboardJS('.to-copy');
$('.to-copy').click(function () {
    M.toast({
        html: '已复制'
    });
});
