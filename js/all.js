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

// Companions filter (online / offline)
$('#Companion-Menu').on('click', function(e){
    e.preventDefault();
    const $a = $(e.target).closest('a');
    if($a.length === 0){ return; }
    // active state
    $a.addClass('active').parent().siblings().children('a').removeClass('active');

    const filter = $a.data('filter') || 'all';
    const $cards = $('#CompanionsList > li');
    if(filter === 'all'){
        $cards.removeClass('d-none');
        return;
    }
    $cards.each(function(){
        const mode = $(this).data('mode');
        $(this).toggleClass('d-none', mode !== filter);
    });
    // provide quick navigation to booking with the selected type
    const link = $a.data('link');
    if(link){
        // Update any "開始陪伴" buttons within this page to carry the selection
        $('a[href="./withYou.html"], a[href="withYou.html"]').each(function(){
            $(this).attr('href', link);
        });
    }
});

// Booking Wizard Logic
$(function(){
    const $wizard = $('#bookingWizard');
    const $profile = $('#companionProfile');
    if($wizard.length === 0 && $profile.length === 0){ return; }

    const DEPOSIT_AMOUNT = 500; // 預設訂金金額（新台幣）
    const DEPOSIT_RULES = {
        base: { online: 500, offline: 500, notSure: 500 },
        companionAdjustments: { /* 例如：Michael: 0, Birdy: 0 */ }
    };
    const state = {
        currentStep: 1,
        data: {
            lastName: '', firstName: '', phoneNumber: '', email: '',
            region: '', city: '',
            companionType: 'online', companion: '',
            statuses: [], note: '', date: '', time: '',
            payment: { name:'', number:'', expiry:'', cvc:'' }
        }
    };

    // 伴師提供的陪伴方式（與 companions 頁面一致）
    const COMPANIONS_INFO = {
        Meili: {
            mode: 'online',
            title: '繪畫陪伴師｜線上',
            image: './images/05.png',
            bio: '擅長在溫和的對話與繪畫引導中，陪你看見日常互動的細節；擅長面向：情緒梳理、親子溝通。',
            tags: ['線上','情緒梳理','親子溝通']
        },
        Zoe: {
            mode: 'offline',
            title: '繪畫陪伴師｜實體',
            image: './images/07.png',
            bio: '在穩定的現場陪伴中，讓你有空間慢慢說與畫；擅長面向：情境釐清、建立節奏。',
            tags: ['實體','情境釐清','建立節奏']
        },
        Michael: {
            mode: 'online',
            title: '繪畫陪伴師｜線上',
            image: './images/06.png',
            bio: '善於結構化地整理你在教養中的困惑，並以繪畫作為梳理的媒介。',
            tags: ['線上','結構化整理']
        },
        Birdy: {
            mode: 'offline',
            title: '繪畫陪伴師｜實體',
            image: './images/Michael.png',
            bio: '提供安穩的在場陪伴，讓你能在被看見的過程中逐步調整與前進。',
            tags: ['實體','安穩在場']
        }
    };

    const $steps = $wizard.find('.step');
    const $timeSlots = $('#timeSlots');
    const $availabilityNotice = $('#availabilityNotice');
    const timeOptions = ['09:00','11:00','14:00','16:00','20:00'];

    // 繪畫陪伴師時段設定（示範用）
    const AVAILABILITY = {
        defaultOpen: true,
        defaultSlots: timeOptions,
        companions: {
            Meili: {
                open: true,
                weeklySlots: { // 0(日)~6(六)
                    1: ['09:00','14:00'], // 一
                    3: ['11:00','16:00'], // 三
                    5: ['09:00','20:00']  // 五
                }
            },
            Zoe: {
                open: true,
                weeklySlots: {
                    2: ['09:00','11:00'], // 二
                    4: ['14:00','16:00']  // 四
                }
            },
            Michael: {
                open: true,
                weeklySlots: {
                    6: ['09:00','11:00'] // 六
                }
            },
            Birdy: {
                open: false, // 暫不開放預約
                weeklySlots: {}
            }
        }
    };

    function computeDeposit(){
        const f = state.data;
        let amount = (DEPOSIT_RULES.base[f.companionType] ?? DEPOSIT_AMOUNT);
        if(f.companion && DEPOSIT_RULES.companionAdjustments[f.companion]){
            amount += DEPOSIT_RULES.companionAdjustments[f.companion];
        }
        return amount;
    }

    function goToStep(n){
        state.currentStep = n;
        $steps.addClass('d-none');
        $steps.filter(`[data-step="${n}"]`).removeClass('d-none');
        // Update stepper header color
        $wizard.find('ol li').each(function(i){
            const idx = i+1;
            const $circle = $(this).find('.rounded-circle');
            if(idx === n){
                $circle.removeClass('bg-secondary').addClass('bg-primary');
            }else{
                $circle.removeClass('bg-primary').addClass('bg-secondary');
            }
        });
    }

    function setMinDateToday(){
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth()+1).padStart(2,'0');
        const dd = String(today.getDate()).padStart(2,'0');
        const min = `${yyyy}-${mm}-${dd}`;
        $('#bookingDate').attr('min', min);
    }

    function renderTimeSlots(){
        const dateValue = $('#bookingDate').val();
        const companion = $('#Companion').val();
        const cfg = AVAILABILITY.companions[companion] || { open: AVAILABILITY.defaultOpen, weeklySlots: {} };

        $timeSlots.empty();
        $availabilityNotice.text('');

        // 尚未選擇日期：提示並顯示置灰時段
        if(!dateValue){
            $availabilityNotice.text('請先選擇日期以顯示可預約時段。');
            AVAILABILITY.defaultSlots.forEach(function(t){
                const id = `slot-${t.replace(':','')}`;
                const $input = $(`<input type="radio" class="btn-check" name="timeSlot" autocomplete="off" disabled>`).attr('id', id).val(t);
                const $label = $(`<label class="btn btn-outline-secondary disabled rounded-pill px-3 py-2" for="${id}"></label>`).text(t);
                $timeSlots.append($input).append($label);
            });
            return;
        }

        const day = new Date(dateValue).getDay(); // 0(日)~6(六)
        let slots = [];
        if(cfg.open){
            slots = cfg.weeklySlots[day] || AVAILABILITY.defaultSlots;
        }

        // 伴師暫不開放：顯示置灰時段
        if(!cfg.open){
            $availabilityNotice.text(`陪伴師 ${companion || '（未指定）'} 目前暫不開放預約。`);
            AVAILABILITY.defaultSlots.forEach(function(t){
                const id = `slot-${t.replace(':','')}`;
                const $input = $(`<input type="radio" class="btn-check" name="timeSlot" autocomplete="off" disabled>`).attr('id', id).val(t);
                const $label = $(`<label class="btn btn-outline-secondary disabled rounded-pill px-3 py-2" for="${id}"></label>`).text(t);
                $timeSlots.append($input).append($label);
            });
            return;
        }

        // 該日無時段：顯示置灰時段
        if(slots.length === 0){
            $availabilityNotice.text('該日期暫無可預約時段。');
            AVAILABILITY.defaultSlots.forEach(function(t){
                const id = `slot-${t.replace(':','')}`;
                const $input = $(`<input type="radio" class="btn-check" name="timeSlot" autocomplete="off" disabled>`).attr('id', id).val(t);
                const $label = $(`<label class="btn btn-outline-secondary disabled rounded-pill px-3 py-2" for="${id}"></label>`).text(t);
                $timeSlots.append($input).append($label);
            });
            return;
        }

        // 可預約：顯示可選時段
        $availabilityNotice.text(`陪伴師 ${companion || '（未指定，將為你安排）'}：此日期可預約時段如下。`);
        slots.forEach(function(t){
            const id = `slot-${t.replace(':','')}`;
            const $input = $(`<input type="radio" class="btn-check" name="timeSlot" autocomplete="off">`).attr('id', id).val(t);
            const $label = $(`<label class="btn btn-outline-primary rounded-pill px-3 py-2" for="${id}"></label>`).text(t);
            $timeSlots.append($input).append($label);
        });
    }

    function collectStep1(){
        state.data.lastName = $('#lastName').val().trim();
        state.data.firstName = $('#firstName').val().trim();
        state.data.phoneNumber = $('#phoneNumber').val().trim();
        state.data.email = $('#email').val().trim();
        state.data.region = $('#Region').val();
        state.data.city = $('#County-and-city').val();
        state.data.companionType = $('#CompanionType').val();
        state.data.companion = $('#Companion').val();
        state.data.statuses = ['status1','status2','status3']
            .filter(id => $(`#${id}`).is(':checked'))
            .map(id => $(`#${id}`).val());
        state.data.note = $('#content').val().trim();
    }

    function validStep1(){
        const f = state.data;
        const requireFilled = f.lastName && f.firstName && f.phoneNumber && f.email && f.companionType;
        if(!requireFilled) return false;
        if(f.companionType === 'offline'){
            const regionValid = f.region && f.region !== 'none';
            const cityValid = f.city && f.city !== 'none';
            return regionValid && cityValid;
        }
        return true;
    }

    function collectStep2(){
        state.data.date = $('#bookingDate').val();
        state.data.time = $('input[name="timeSlot"]:checked').val() || '';
    }

    function validStep2(){
        return !!(state.data.date && state.data.time);
    }

    function collectStep3(){
        state.data.payment.name = $('#cardName').val().trim();
        state.data.payment.number = $('#cardNumber').val().replace(/\s+/g,'');
        state.data.payment.expiry = $('#cardExpiry').val().trim();
        state.data.payment.cvc = $('#cardCvc').val().trim();
    }

    function validStep3(){
        const p = state.data.payment;
        return p.name && p.number && p.expiry && p.cvc;
    }

    function buildSummaryHtml(){
        const f = state.data;
        const name = `${f.lastName}${f.firstName}`;
        const typeText = f.companionType === 'online' ? '線上繪畫陪伴' : (f.companionType === 'offline' ? '實體繪畫陪伴' : '待確認');
        const comp = f.companion ? f.companion : '安排合適的陪伴師';
        const statuses = f.statuses.length ? f.statuses.join('、') : '未勾選';
        const regionLine = f.companionType === 'offline' ? `<div>地區：${f.region}／${f.city}</div>` : '';
        return `
            <div>姓名：${name}</div>
            <div>聯絡電話：${f.phoneNumber}</div>
            <div>電子郵件：${f.email}</div>
            <div>陪伴方式：${typeText}</div>
            ${regionLine}
            <div>陪伴師：${comp}</div>
            <div>目前狀態：${statuses}</div>
            <div>備註：${f.note || '（無）'}</div>
            <hr class="my-2">
            <div>預約日期：${f.date}</div>
            <div>預約時段：${f.time}</div>
            <div class="mt-2">應付訂金：NT$ ${computeDeposit().toLocaleString()}</div>
        `;
    }

    function toggleOfflineLocation(){
        const type = $('#CompanionType').val();
        const show = type === 'offline';
        $('#offlineLocation').toggleClass('d-none', !show);
    }

    function populateCompanionOptions(){
        const type = $('#CompanionType').val();
        const all = Object.keys(COMPANIONS_INFO);
        let list = all.filter(function(name){
            if(type === 'notSure') return true;
            return COMPANIONS_INFO[name].mode === type;
        });
        const opts = ['<option value="">讓我們為你安排合適的陪伴師</option>']
            .concat(list.map(n => `<option value="${n}">${n}</option>`));
        $('#Companion').html(opts.join(''));
    }

    function applyQueryType(){
        const params = new URLSearchParams(window.location.search);
        const q = params.get('type'); // online | offline | notSure
        if(q && ['online','offline','notSure'].includes(q)){
            $('#CompanionType').val(q);
        }
    }

    function updateSummary(){
        $('#summaryContent').html(buildSummaryHtml());
        $('#depositAmount').text(`NT$ ${computeDeposit().toLocaleString()}`);
    }
    function updateFinalSummary(){
        $('#finalSummary').html(buildSummaryHtml());
        $('#finalDeposit').text(`NT$ ${computeDeposit().toLocaleString()}`);
    }

    function genBookingId(){
        return 'WY' + Math.random().toString(36).slice(2,8).toUpperCase();
    }

    // Init
    // Booking Wizard init
    if($wizard.length){
        setMinDateToday();
        renderTimeSlots();
        goToStep(1);
        // 初始：依網址參數設定陪伴方式並更新地區顯示/伴師清單
        applyQueryType();
        toggleOfflineLocation();
        populateCompanionOptions();
        // 變更陪伴方式時：更新地區顯示與伴師清單
        $('#CompanionType').on('change', function(){
            toggleOfflineLocation();
            populateCompanionOptions();
        });
    }

    // Companion Profile init
    if($profile.length){
        const params = new URLSearchParams(window.location.search);
        const name = params.get('comp') || 'Meili';
        const info = COMPANIONS_INFO[name] || COMPANIONS_INFO['Meili'];
        $('#companionImage').attr('src', info.image).attr('alt', name);
        $('#companionName').text(name);
        $('#companionMode').text(info.mode === 'online' ? '線上' : '實體');
        $('#companionTitle').text(info.title);
        $('#companionBio').text(info.bio);
        const tagsHtml = (info.tags || []).map(t => `<span class="badge rounded-pill bg-light text-dark border me-1 mb-1">${t}</span>`).join('');
        $('#companionTags').html(tagsHtml);
        const startHref = `./withYou.html?type=${info.mode}&comp=${encodeURIComponent(name)}`;
        $('#startLink').attr('href', startHref);
    }
    // 日期與陪伴師變更時，重算時段
    $('#bookingDate').on('change', renderTimeSlots);
    $('#Companion').on('change', function(){ collectStep1(); renderTimeSlots(); });

    // Navigation
    $('#toStep2').on('click', function(){
        collectStep1();
        if(!validStep1()){
            alert('請完整填寫基本資料與地區。');
            return;
        }
        goToStep(2);
        renderTimeSlots();
    });
    $('#backToStep1').on('click', function(){ goToStep(1); });

    $('#toStep3').on('click', function(){
        collectStep2();
        if(!validStep2()){
            alert('請選擇日期與時段。');
            return;
        }
        updateSummary();
        goToStep(3);
    });
    $('#backToStep2').on('click', function(){ goToStep(2); });

    $('#toStep4').on('click', function(){
        collectStep3();
        if(!validStep3()){
            alert('請完整填寫付款資訊（示範用）。');
            return;
        }
        const id = genBookingId();
        $('#bookingId').text(id);
        updateFinalSummary();
        goToStep(4);
    });
});