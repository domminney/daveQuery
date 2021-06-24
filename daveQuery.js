// This is a jQuery replacement designed to only do the things I used jQuery for with a few differences
// Inspired by Web Dev Simplified's YouTube Video About jQuery Replacement

class ElementCollection extends Array {

    // events

    on(evt, fn) {

        this.forEach((elem) => {
            // check if function is really string and turn to function
            if (typeof fn === 'string' || fn instanceof String) {
                fn = Function(fn)
            }
            elem.addEventListener(evt, fn)
        })
        return this
    }

    click(fn) {
        if (fn === undefined) {
            this.forEach((elem) => {
                var evt = new MouseEvent("click")
                elem.dispatchEvent(evt)
            })
            return this
        }
        this.on("click", fn)
        return this
    }

    // class

    toggleClass(cls) {
        this.forEach((elem) => {
            elem.classList.toggle(cls)
        })
        return this
    }

    removeClass(cls) {
        if (!Array.isArray(cls)) cls = [cls]
        this.forEach((elem) => {
            cls.forEach((clsElem) => {
                elem.classList.remove(clsElem)
            })
        })
        return this
    }

    addClass(cls) {
        if (!Array.isArray(cls)) cls = [cls]
        this.forEach((elem) => {
            cls.forEach((clsElem) => {
                elem.classList.add(clsElem)
            })

        })
        return this
    }

    hasClass(cls) {
        var className = " " + cls + " "
        var has = false;
        this.forEach((elem) => {
            if ((" " + elem.className + " ").replace(/[\n\t\r]/g, " ").indexOf(className) > -1) {
                has = true
                return true
            }
        })
        return has
    }

    // css

    css(p1, p2) {
        if (typeof p1 === 'object') {
            this.forEach((elem) => {
                Object.keys(p1).forEach((k) => {
                    elem.style[k] = p1[k]
                })
            })
            return this
        }
        this.forEach((elem) => {
            elem.style[p1] = p2
        })
        return this
    }

    width(w) {

        if (w === undefined) {
            return this[0].clientWidth
        }

        if (!(typeof w === "string" || w instanceof String)) {
            w = w.toString() + 'rem'
        }
        this.forEach((elem) => {
            elem.style.width = w
        })

        return this
    }

    height(h) {

        if (h === undefined) {
            return this[0].clientHeight
        }
        if (!(typeof h === "string" || h instanceof String)) {
            h = h.toString() + 'rem'
        }
        this.forEach((elem) => {
            elem.style.height = h
        })

        return this
    }

    sizeRatio(r) {
        if (!$.ratioresize) {
            $(window).on("resize", function () {
                $(".dq--sizeratio").forEach((each) => {
                    $(each).__doResizeRatio()
                })
            })
            $.ratioresize = true
        }
        this.forEach((elem) => {
            if (!$(elem).data("dq-sizeratio")) {
                $(elem).addClass("dq--sizeratio")
            }
            $(elem).data("dq-sizeratio", r.toString())
            this.__doResizeRatio(elem)
        })
    }

    __doResizeRatio(each) {
        each = each || this
        var w = parseFloat($(each).width())
        var r = parseFloat($(each).data("dq-sizeratio"))
        var h = w * (1 / r)
        $(each).height(h.toString() + "px")
        return this
    }

    // dom element insert & removal

    append(appendObj) {
        this.forEach((elem) => {
            var aoa = $(appendObj)
            aoa.forEach((ao) => {
                elem.append(ao)

            })
        })
        return this
    }

    prepend(prependObj) {
        this.forEach((elem) => {
            var poa = $(prependObj).reverse()
            poa.forEach((po) => {
                elem.prepend(po)
            })
        })
        return this
    }

    appendTo(appendToObj) {
        $(appendToObj).append(this)
        return this
    }

    prependTo(prependToObj) {
        $(prependToObj).prepend(this)
        return this
    }

    insertAfter(iaObj) {
        iaObj = $(iaObj)
        this.forEach((elem) => {
            iaObj[0].parentNode.insertBefore(elem, iaObj[0].nextSibling)
            iaObj[0] = elem
        })
        return this
    }

    remove() {
        this.forEach((elem) => {
            elem.remove()
        })
    }

    // attributes

    attr(attr, val) {
        if (typeof val === 'undefined') {
            try {
                return this[0].getAttribute(attr)
            } catch (error) {
                return ""
            }
        }

        this.forEach((elem) => {
            elem.setAttribute(attr, val)
        })
        return this
    }

    data(key, val) {
        return this.attr("data-" + key, val)
    }

    // return other dom elements

    next() {
        return $(this[0].nextElementSibling)
    }

    prev() {
        return $(this[0].previousElementSibling)
    }

    first() {
        return $(this[0])
    }

    last() {
        return $(this[this.length - 1])
    }

    firstChild() {
        return $(this[0].firstElementChild)
    }

    lastChild() {
        return $(this[0].lastElementChild)
    }

    find(selector) {
        var selected = new ElementCollection()
        this.forEach((elem) => {
            selected = selected.concat($(selector, elem))
        })
        return selected
    }

    parent() {
        return $(this[0].parentNode)
    }

    children() {
        var selected = new ElementCollection()
        this.forEach((elem) => {
            selected = new ElementCollection(...selected, ...elem.childNodes)
        })
        return selected
    }

    // text & html content

    html(obj) {
        if (typeof obj !== 'undefined') {
            this.forEach((elem) => {
                obj = $(obj)
                while (elem.firstChild) {
                    elem.firstChild.remove()
                }
                obj.forEach((o) => {
                    elem.append(o)
                })
            })
            return this
        }
        return this[0].innerHTML
    }

    text(text) {
        if (typeof text === 'undefined') {
            return this[0].innerText
        }
        this.forEach((elem) => {
            while (elem.firstChild) {
                elem.firstChild.remove()
            }
            elem.innerText = text
        })
        return this
    }


    // display & animations

    show() {

        this.forEach((elem) => {
            elem = $(elem)
            var disp = elem.data("dq-style-display")
            if (!disp) disp = 'block'
            elem[0].style.display = disp
        })

        return this
    }

    hide() {

        this.forEach((elem) => {
            elem = $(elem)
            var disp = elem[0].style.display
            if (disp === '' || disp === 'none') disp = 'block'
            elem.data("dq-style-display", disp)
            elem[0].style.display = 'none'
        })

        return this
    }

    // form

    val(val) {

        if (typeof val === 'undefined') {
            if (this[0].type === 'checkbox') {
                if (this[0].checked) return 1
                return 0
            }
            if (this.length) {
                return this[0].value.toString()
            }
            return ''
        }


        this.forEach((elem) => {
            var ovu = $(elem).data("dq-onvalupdate")
            if (elem.type === 'checkbox') {
                elem.checked = val
                if (ovu !== '') {
                    var fn = new Function('elem', ovu)
                    setTimeout(fn, 0, elem)
                }
                return false
            }
            elem.value = val
            if (val) { $(elem).addClass("dq--hasvalue") } else { $(elem).removeClass("dq--hasvalue") }
        })

        return this
    }

    vals(objVals) {
        objVals = objVals || {}

        if (this.length === 0) return objVals

        this.forEach((elem) => {
            elem = $(elem)
            var k = elem.attr("name")
            if (k) {
                if (!Object.keys(objVals).includes(k)) {
                    objVals[k] = elem.val()
                    return false
                }
                if (Array.isArray(objVals[k])) {
                    objVals[k].push(elem.val())
                    return false
                }
                objVals[k] = [objVals[k], elem.val()]
            }
        })

        objVals = this.children().vals(objVals)


        return objVals
    }
    // UI

    toToggle() {

        this.forEach((input) => {

            input = $(input)

            if (input[0].type !== 'checkbox') return false
            if (input.parent().hasClass("dq--formitem")) return false

            var container = $("<div />").addClass(["dq--toggle--container", "dq--formitem"]).insertAfter(input)
            container.append(input).append($("<div class='dq--toggle--switch' />"))
            if (input.val()) container.addClass("dq--checked")

            input.hide()

            container.click(function () {
                $(this).find("input").click()
            })

            var label = $("<label />").text(input.data("label")).prependTo(container)

            input.data("dq-onvalupdate", "elem.dispatchEvent(new Event('change'))")

            input.on("change", function () {
                if (this.checked) {
                    $(this).parent().addClass("dq--checked")
                    return false
                }
                $(this).parent().removeClass("dq--checked")
            })

        })

        return this

    }

    toTick() {

        this.forEach((input) => {

            input = $(input)

            if (input[0].type !== 'checkbox') return false
            if (input.parent().hasClass("dq--formitem")) return false

            var container = $("<div />").addClass(["dq--tick--container", "dq--formitem"]).insertAfter(input)
            container.append(input).append($("<div class='dq--tick--switch' />"))
            if (input.val()) container.addClass("dq--checked")

            input.hide()

            container.click(function () {
                $(this).find("input").click()
            })

            var label = $("<label />").text(input.data("label")).prependTo(container)

            input.data("dq-onvalupdate", "elem.dispatchEvent(new Event('change'))")

            input.on("change", function () {
                if (this.checked) {
                    $(this).parent().addClass("dq--checked")
                    return false
                }
                $(this).parent().removeClass("dq--checked")
            })

        })

        return this

    }

    toImgListItem() {

        this.forEach((img) => {
            if (img.tagName !== 'IMG') return false
            img = $(img)
            if (img.parent().hasClass("dq--formitem")) return false
            var container = $("<div />").addClass(["dq--list--item", "dq--list--item--image", "dq--formitem"]).insertAfter(img)
            img.click("event.stopPropagation()")
            container.append(img)
            var lbl = img.data("label")
            if (lbl) container.append($("<p></p>").text(lbl))
            var htmlSel = img.data("html")
            if (htmlSel) {
                container.append($(htmlSel))
            }
            container.click(function () {
                $(this).find("img").click()
            })

        })

        return this

    }

    toListItem() {

        this.forEach((elem) => {
            elem = $(elem)
            if (elem[0].tagName !== 'DIV') return false
            if (elem.parent().hasClass("dq--formitem")) return false
            var container = $("<div />").addClass(["dq--list--item", "dq--formitem"]).insertAfter(elem)
            elem.click("event.stopPropagation()")
            container.append(elem)
            container.click(function () {
                $(this).firstChild().click()
            })

        })

        return this

    }

    toFormItem(options) {

        this.forEach((elem) => {


            if (elem.tagName === 'INPUT') {
                if (elem.type === 'checkbox') {
                    if (options.checkboxType === 'tick') {
                        $(elem).toTick()
                        return false
                    }
                    $(elem).toToggle()
                    return false
                }
                if ($(elem).parent().hasClass("dq--formitem")) return false
                var container = $("<div />").addClass(["dq--formitem", "dq--formitem--input"]).insertAfter(elem).append(elem)
                container.append($("<label />").text($(elem).data("label"))).click(function () {
                    $(this).find("input")[0].focus()
                    event.stopPropagation()
                })
                $(elem).on("blur", function () {
                    if ($(this).val() === '') {
                        $(this).removeClass("dq--hasvalue")
                        return false
                    }
                    $(this).addClass("dq--hasvalue")
                })
                return false
            }

            if (elem.tagName === 'SELECT') {

                if ($(elem).parent().hasClass("dq--formitem")) return false
                var container = $("<div />").addClass(["dq--formitem", "dq--formitem--select"]).insertAfter(elem).append(elem)
                container.prepend($("<label />").text($(elem).data("label")))
                return false
            }

            if (elem.tagName === 'TEXTAREA') {

                if ($(elem).parent().hasClass("dq--formitem")) return false
                var container = $("<div />").addClass(["dq--formitem", "dq--formitem--textarea"]).insertAfter(elem).append(elem)
                container.prepend($("<label />").text($(elem).data("label")))
                $(elem).on("keyup", function () {
                    this.style.cssText = 'height:auto; padding:0';
                    this.style.cssText = 'height:' + this.scrollHeight + 'px';
                })
                return false
            }

        })

        return this
    }


}

var $ = function (selector, from) {

    from = from || document

    if (typeof selector === 'string' || selector instanceof String) {
        selector = selector.trim()
        if (selector.startsWith("<")) {
            // is html
            var doc = new DOMParser().parseFromString(selector, "text/html")
            return new ElementCollection(...doc.body.childNodes)
        }
        // is selector string
        return new ElementCollection(...from.querySelectorAll(selector))
    }
    if (!Array.isArray(selector)) selector = new ElementCollection(selector)
    // is already an array
    return new ElementCollection(...selector)
}

$.fetch = async function (url, body, token, method, headers, otherSettings) {

    otherSettings = otherSettings || {}

    var settings = {
        method: method,
        headers: {
            'Accept': '*/*',
            ...headers
        },
        ...otherSettings
    }

    method = method || 'POST'

    if (method === 'POST') settings.headers['Content-Type'] = 'application/json'

    if (body) settings.body = JSON.stringify(body)

    if (token) settings.headers.token = token

    try {
        var fetchResponse = await fetch(url, settings)
        var data = await fetchResponse.text()
        try {
            data = JSON.parse(data)
            return data
        } catch (e2) {
            return data
        }

    } catch (e) {
        return e
    }
}

$.post = async function (url, body, token) {
    return await $.fetch(url, body, token, "POST")
}

$.get = async function (url, token) {
    return await $.fetch(url, false, token, "GET")
}

$.__token = ''

$.token = function (t) {
    if (t === undefined) {
        if (!$.__token) $.__token == $.cookie("dqt")
        $.cookie("dqt", $.__token, 1)
        return $.__token
    }
    $.__token = t
    $.cookie("dqt", t, 1)
}

$.cookie = function (name, value, days) {

    if (value === undefined) {
        var cookieArr = document.cookie.split(";")
        for (var i = 0; i < cookieArr.length; i++) {
            var cookiePair = cookieArr[i].split("=")
            if (name == cookiePair[0].trim()) {
                return decodeURIComponent(cookiePair[1])
            }
        }
        return ''
    }

    var cookie = name + "=" + encodeURIComponent(value) + "; path=/"
    if (!days === undefined) {
        cookie += "; max-age=" + (daysToLive * 24 * 60 * 60)
    }
    document.cookie = cookie

}

$.localStorage = function (key, value) {
    if (value === undefined) {
        return localStorage.getItem(key) || ''
    }

    localStorage.setItem(key, value)
    return localStorage.getItem(key)
}

$.addScript = function (src) {
    var script = document.createElement('script')
    script.setAttribute('src', src)
    document.head.appendChild(script)
}