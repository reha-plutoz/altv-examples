'use strict';

let tab = 'person';
let name = '';
let surname = '';
let birthDate = '';
let bodySize = 150;
let gender = 0;
let layout = [];

function setupEvents () {
    $('input[name="gender"]').on('change', onChange);
    $('.on-change-input').on('keydown', onChange);
    $('.on-change-slider').on('change input', onChange);
    $('#create-character').on('click', createCharacter);
    $('.mdl-navigation__link').on('click', onTab);

    if('alt' in window)
    {
        alt.on('character:createFailed', () => {
            $('#create-loader').hide();
            $('#create-character').show();
        });
    }
}

function onChange () {
    // face
    let mother     = parseInt($('#mother-face').val())
    let father     = parseInt($('#father-face').val())
    let face       = parseFloat($('#face').val())
    let skinColor  = parseFloat($('#skin-color').val())

    // 1
    let mask       = parseInt($('#mask').val());
    let maskColor  = parseInt($('#mask-color').val());
    // 2
    let hair       = parseInt($('#hair').val());
    let hairColor  = parseInt($('#hair-color').val());
    // 3
    let torso      = parseInt($('#torso').val());
    let torsoColor = parseInt($('#torso-color').val());
    // 4
    let pants      = parseInt($('#pants').val());
    let pantsColor = parseInt($('#pants-color').val());
    // 5
    let bag      = parseInt($('#bag').val());
    let bagColor = parseInt($('#bag-color').val());
    // 6
    let shoes      = parseInt($('#shoes').val());
    let shoesColor = parseInt($('#shoes-color').val());
    // 7
    let neck       = parseInt($('#neck').val());
    let neckColor  = parseInt($('#neck-color').val());
    // 8
    let shirt = parseInt($('#shirt').val());
    let shirtColor  = parseInt($('#shirt-color').val());
    // 9
    let vest = parseInt($('#vest').val());
    let vestColor  = parseInt($('#vest-color').val());
    // 11
    let torso2 = parseInt($('#torso2').val());
    let torso2Color  = parseInt($('#torso2-color').val());

    // skills
    let staminaSkill = parseInt($('#skill-stamina').val())
    let strengthSkill = parseInt($('#skill-strength').val())
    let lungSkill = parseInt($('#skill-lung').val())
    let vehicleSkill = parseInt($('#skill-vehicle').val())
    let shootingSkill = parseInt($('#skill-shooting').val())
    let stealthSkill = parseInt($('#skill-stealth').val())
    let skillPoints = 10 - staminaSkill - strengthSkill - lungSkill - vehicleSkill - shootingSkill - stealthSkill;

    // face
    $('#mother-face-number').text(mother);
    $('#father-face-number').text(father);
    $('#face-number').text(face);
    $('#skin-color-number').text(skinColor);

    // 1
    $('#mask-number').text(mask);
    $('#mask-color-number').text(maskColor);
    // 2
    $('#hair-number').text(hair);
    $('#hair-color-number').text(hairColor);
    // 3
    $('#torso-number').text(torso);
    $('#torso-color-number').text(torsoColor);
    // 4
    $('#pants-number').text(pants);
    $('#pants-color-number').text(pantsColor);
    // 5
    $('#bag-number').text(bag);
    $('#bag-color-number').text(bagColor);
    // 6
    $('#shoes-number').text(shoes);
    $('#shoes-color-number').text(shoesColor);
    // 7
    $('#neck-number').text(neck);
    $('#neck-color-number').text(neckColor);
    // 8
    $('#shirt-number').text(shirt);
    $('#shirt-color-number').text(shirtColor);
    // 9
    $('#vest-number').text(vest);
    $('#vest-color-number').text(vestColor);
    // 11
    $('#torso2-number').text(torso2);
    $('#torso2-color-number').text(torso2Color);

    // skills
    $('#skill-stamina-number').text(staminaSkill);
    $('#skill-strength-number').text(strengthSkill);
    $('#skill-lung-number').text(lungSkill);
    $('#skill-vehicle-number').text(vehicleSkill);
    $('#skill-shooting-number').text(shootingSkill);
    $('#skill-stealth-number').text(stealthSkill);
    $('#skill-points').text(skillPoints);
    $('#skill-points').css('color', skillPoints < 0 ? 'red' : (0 === skillPoints ? '' : 'green'))

    name = $('#name').val();
    surname = $('#surname').val();
    birthDate = $('#birthdate').val();
    bodySize = $('#bodysize').val();
    gender = parseInt($('input[name="gender"]:checked').val());
    layout = [
        {
            mother: mother,
            father: father,
            face: face,
            skin: skinColor,
        },
        {
            item: mask,
            color: maskColor,
        },
        {
            item: hair,
            color: hairColor,
        },
        {
            item: torso,
            color: torsoColor,
        },
        {
            item: pants,
            color: pantsColor,
        },
        {
            item: bag,
            color: bagColor,
        },
        {
            item: shoes,
            color: shoesColor,
        },
        {
            item: neck,
            color: neckColor,
        },
        {
            item: shirt,
            color: shirtColor,
        },
        {
            item: vest,
            color: vestColor,
        },
        {
            item: 0,
            color: 0,
        },
        {
            item: torso2,
            color: torso2Color,
        },
    ];

    if('alt' in window)
    {
        alt.emit('character:previewLayout', gender, layout);
        alt.emit('character:getRanges', layout);
    }
}

function createCharacter () {
    $('#create-character').hide();
    $('#create-loader').show();
    if('alt' in window)
    {
        alt.emit('character:createWithLayout', {name: name, surname: surname, birthDate: birthDate, bodySize: bodySize, gender: gender, layout: layout});
    }
}

function onTab(e) {
    let target = $(e.target)

    // remove actives
    $('.mdl-navigation__link').removeClass('is-active')

    // add active
    target.addClass('is-active')

    // hide all
    $('.navigation-link').hide()

    // show new
    let targetPanel = target.attr('data-panel');
    $(`#${targetPanel}-panel`).show();

    // camera focus
    let targetCamera = target.attr('data-camera');
    if('alt' in window)
    {
        alt.emit('character:focus', targetCamera);
    }
}

$(document).ready(() => {
    setupEvents();
    onChange();
});

if('alt' in window)
{
    alt.on('character:setRanges', ranges => {
        // 1
        $('#mask').attr('max', ranges[1].item)
        $('#mask-color').attr('max', ranges[1].color)
        // 2
        $('#hair').attr('max', ranges[2].item)
        $('#hair-color').attr('max', ranges[2].color)
        // 3
        $('#torso').attr('max', ranges[3].item)
        $('#torso-color').attr('max', ranges[3].color)
        // 4
        $('#pants').attr('max', ranges[4].item)
        $('#pants-color').attr('max', ranges[4].color)
        // 5
        $('#bag').attr('max', ranges[5].item)
        $('#bag-color').attr('max', ranges[5].color)
        // 6
        $('#shoes').attr('max', ranges[6].item)
        $('#shoes-color').attr('max', ranges[6].color)
        // 7
        $('#neck').attr('max', ranges[7].item)
        $('#neck-color').attr('max', ranges[7].color)
        // 8
        $('#shirt').attr('max', ranges[8].item)
        $('#shirt-color').attr('max', ranges[8].color)
        // 9
        $('#vest').attr('max', ranges[9].item)
        $('#vest-color').attr('max', ranges[9].color)
        // 11
        $('#torso2').attr('max', ranges[11].item)
        $('#torso2-color').attr('max', ranges[11].color)
    });
}
