function toFloat(value)
{
    let fValue = parseFloat(value);
    return parseFloat(fValue.toFixed(4));
}

/*возвращает только число из строки в INT*/
function toInt(value)
{
    return parseInt(value.replace(/[^\d]/g, ''));
}

function toFixed(value1, value2)
{
    let newValue = value1 / value2
    if(newValue <= 999)
    {
        return newValue.toFixed(4);
    }
    else
    {
        return Math.round(newValue);
    }
}

function toLastWord(string)
{
    let lastWord = string.split(" ");
    // return lastWord[lastWord.length-1];
    let word;
    for (let i = 0; i < lastWord.length; ++i)
    {
        if(/\S/.test(lastWord[i]))
        {
            word = i;
        }
    }
    console.log(lastWord[word]);
    return lastWord[word];

}

let Requester =
{
    array: [],
    async Get(string)
    {
        let dat;
        await fetch(string)
            .then((response) =>
            {
                return response.json();
            })
            .then((data) =>
            {
                dat = data;
                // console.log(`data ${typeof(data)}`);
                // console.log(`dat ${typeof(dat)}`);
                // console.log(data);
            });
        return await dat;
    },
    async Transducer(dat)
    {
        return await JSON.parse(dat);
    },
    Builder(dat)
    {
        let Data = new Date();
        let headSpan = document.querySelector("h1.header__text");
        headSpan.innerHTML = `Курс валют от ЦБ РФ <br class="header__br"/> на ${Data.getDate()}-${Data.getMonth()+1}-${Data.getFullYear()} г.`;

        let exchange = document.querySelector(".exchange-rates__tbody");
        let thead = document.querySelector(".exchange-rates__thead");
        thead.insertAdjacentHTML('afterbegin' , `<tr class="exchange-rates__tr" id="thead"/>`);
        let nameItem = document.querySelector(`#thead`);
        nameItem.insertAdjacentHTML('beforeend' ,
            `<td class="exchange-rates__column_name" id="td0">код</td>`);
        nameItem.insertAdjacentHTML('beforeend' ,
            `<td class="exchange-rates__column_name" id="td1">валюта</td>`);
        nameItem.insertAdjacentHTML('beforeend' ,
            `<td class="exchange-rates__column_name" id="td2">Курс ₽</td>`);

        exchange.insertAdjacentHTML('beforeend',
            `<tr class="exchange-rates__tr exchange-rates__tr__control" id="control"/>`);
        let control = document.querySelector(`.exchange-rates__tr__control`);
        control.insertAdjacentHTML('beforeend',
            `<td class="exchange-rates__cell exchange-rates_side exchange-rates__tr_left" id="td0"><div class="search"><input class="search__input" type="search" id="search-by-cod" name="search"></div></td>
<td class="exchange-rates__cell exchange-rates_main exchange-rates__search" id="td1"><div class="search"><input class="search__input" type="search" id="search-by-name" name="search"></div>
<td class="exchange-rates__cell exchange-rates_side exchange-rates__tr_right converter_big" id="td2"><div class="converter"><input class="converter__input" type="search" id="converter" name="converter"></div></td>`);

        let bigSizeArray = Object.keys(dat).length;
        for (let i = 0; i < Object.keys(dat.amount).length; ++i)
        {
            if(dat.ckod[`${i + 7}`] !== null)
            {
                let bkod = dat.bkod[i + 7];
            exchange.insertAdjacentHTML('beforeend',
                `<tr class="exchange-rates__tr exchange-rates__tr_hover" id="tr${i}"/>`);
            let currentItem = document.querySelector(`#tr${i}`);
            currentItem.insertAdjacentHTML('beforeend',
                `<td class="exchange-rates__cell exchange-rates_side exchange-rates__tr_left " id="td0"><span>${dat.ckod[`${i + 7}`]}</span> <div>${bkod}</div></td>`);
            currentItem.insertAdjacentHTML('beforeend',
                `<td class="exchange-rates__cell exchange-rates_main" id="td1"><img class="exchange-rates__flag" src="" alt="${bkod}"><span class="exchange-rates__cell_country"></span><br/><span  class="exchange-rates__cell_currency">${dat.name[`${i + 7}`]}</span></td>`);
            currentItem.insertAdjacentHTML('beforeend',
                `<td class="exchange-rates__cell exchange-rates_side exchange-rates__tr_right" id="td2">${toFixed(toFloat(dat.course[`${i + 7}`]),
                    toInt(`${dat.amount[`${i + 7}`]}`))}</td>`);
            }
        }
    },
    ExtensionBuilder(get, get2)
    {
        let full = document.querySelectorAll('.exchange-rates__tr_hover');
        for (let i = 0; i < full.length; ++i)
        {
            for (let ii = 0; ii < get.country.length; ++ii)
            {
                if(get.country[ii].alpha2 === (full[i].firstElementChild.querySelector(`div`).innerHTML).substring(0,2))
                {
                    full[i].firstElementChild.nextElementSibling.querySelector(`.exchange-rates__cell_country`).innerHTML = get.country[ii].name;
                    full[i].firstElementChild.nextElementSibling.querySelector(`.exchange-rates__flag`).src = `/build/assets/icons/flags/${get.country[ii].alpha2}.png`;
                    break;
                }
                else if(ii === get.country.length-1)
                {
                    full[i].firstElementChild.nextElementSibling.querySelector(`.exchange-rates__cell_country`).innerHTML = full[i].firstElementChild.nextElementSibling.querySelector(`.exchange-rates__cell_currency`).innerHTML;
                }
            }
        }
    }
}

let Doings =
{
    imageDisplay(value, search, text)
    {
        if(value !== "")
        {
            search.classList.add(`${text}_hide-icon`);
        }
        else
        {
            search.classList.remove(`${text}_hide-icon`);
        }
    },
    NewSearch()
    {
       document.querySelectorAll('.search').forEach((search) =>
       {
           search.addEventListener( 'input', () =>
           {
               let value = search.querySelector('input').value;
               this.imageDisplay(value, search, "search");

               let full = document.querySelectorAll('.exchange-rates__tr_hover');
               let parentId = search.parentElement.id;
               for (let i = 0; i < full.length; ++i)
               {
                   let td = parentId === 'td1' ? 'td2' : 'td1'
                   let indexOf = full[i].querySelector(`#${parentId}`).innerHTML.toLowerCase().indexOf(`${value.toLowerCase()}`);
                   if(indexOf === -1)
                   {
                       if(full[i].classList.contains(`exchange-rates__tr_hide`) === false
                           && full[i].classList.contains(`${td}`) === false && full[i].classList.contains(`td2`) === false)
                       {
                           full[i].classList.add('exchange-rates__tr_hide');
                           full[i].classList.add(`${parentId}`);
                       }
                   }
                   else
                   {
                       if(full[i].classList.contains(`exchange-rates__tr_hide`) === true
                           && full[i].classList.contains(`${parentId}`) === true)
                       {
                           full[i].classList.remove('exchange-rates__tr_hide');
                           full[i].classList.remove(`${parentId}`);
                       }
                   }
               }
           });
       });
    },
    NewConverter()
    {
        document.querySelectorAll('.converter').forEach((converter) =>
        {
            converter.addEventListener( 'input', () =>
            {
                let value = converter.querySelector('input').value;
                this.imageDisplay(value, converter, "converter");

                let full = document.querySelectorAll('.exchange-rates__tr_hover');
                let parentId = converter.parentElement.id;
                for (let i = 0; i < full.length; ++i)
                {
                    let float = toFloat(full[i].querySelector(`#${parentId}`).innerHTML);
                    if(float > toInt(value) && full[i].classList.contains(`td0`) === false && full[i].classList.contains(`td1`) === false)
                    {
                        full[i].classList.add('exchange-rates__tr_hide');
                        full[i].classList.add('td2');
                    }
                    else if(full[i].classList.contains(`${parentId}`) === true)
                    {
                        full[i].classList.remove('exchange-rates__tr_hide');
                        full[i].classList.remove('td2');
                    }
                }
            });
        });
    },
}

Main();
async function Main()
{
    let get = await Requester.Transducer(await Requester.Get('http://192.168.0.106/build/php/base/table.json'));
    await Requester.Builder(get);
    let get2 = await Requester.Get('http://192.168.0.106/build/php/base/codename.json');
    await Requester.ExtensionBuilder(get2, get);
    await Doings.NewSearch();
    await Doings.NewConverter();
}
