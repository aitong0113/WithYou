let Arr_Region = {
    'North-Region':[
        ['臺北市','Taipei City'],
        ['新北市','New Taipei City'],
        ['基隆市','Keelung City'],
        ['桃園市','Taoyuan City'],
        ['新竹縣','Hsinchu County'],
        ['新竹市','Hsinchu City'],
        ['宜蘭縣','Yilan County'],
    ],
    'Middle-Region':[
        ['苗栗縣','Miaoli County'],
        ['臺中市','Taichung City'],
        ['彰化縣','Changhua County'],
        ['南投縣','Nantou County'],
        ['雲林縣','Yunlin County']
    ],
    'South-Region':[
        ['嘉義縣','Chiayi County'],
        ['嘉義市','Chiayi City'],
        ['臺南市','Tainan City'],
        ['高雄市','Kaohsiung City'],
        ['屏東縣','Pingtung County']
    ],
    'East-Region':[
        ['花蓮縣','Hualien County'],
        ['臺東縣','Taitung County']
    ],
    'Outlying-islands':[
        ['澎湖縣','Penghu County'],
        ['金門縣','Kinmen County'],
        ['連江縣','Lienchiang County']
    ],
};

$('#Region').on('change',function(){
    if($('#Region option:selected').val() == 'none'){
        return
    }else{
        let Region = $('#Region option:selected').val();
        let str = ``;
        Arr_Region[Region].forEach(function(item){
            str += `
            <option value="${item[1]}">${item[0]}</option>
            `;
        })
        $('#County-and-city').html(str);
    }
});

$('#Designer-Menu').click(function (e) { 
    e.preventDefault();
    console.log($(e.target).closest('a').parent().siblings().children('a'))
    $(e.target).closest('a').addClass('active').parent().siblings().children('a').removeClass('active');
});