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
            return this[0].getAttribute(attr)
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
        })

        return this
    }

    // display & animations

    show() {

        this.forEach((elem) => {
            elem = $(elem)
            var disp = elem.data("dq-style-display")
            if (disp === '') disp = 'block'
            elem[0].style.display = disp
        })

        return this
    }

    hide() {

        this.forEach((elem) => {
            elem = $(elem)
            var disp = elem[0].style.display
            if (disp === '') disp = 'block'
            elem.data("dq-style-display", disp)
            elem[0].style.display = 'none'
        })

        return this
    }

    // UI

    toToggle() {

        this.forEach((input) => {

            input = $(input)

            if (input[0]?.type !== 'checkbox') return false
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

            if (input[0]?.type !== 'checkbox') return false
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
            if (img.tagName!=='IMG') return false
            img = $(img)
            if (img.parent().hasClass("dq--formitem")) return false
            var container = $("<div />").addClass(["dq--list--item", "dq--list--item--image","dq--formitem"]).insertAfter(img)
            img.click("event.stopPropagation()")
            container.append(img)
            container.append($("<p></p>").text(img.data("label")))
            container.click(function(){                
                $(this).find("img").click()                
            })

        })

        return this

    }


}

var $ = function (selector, from) {

    from = from ?? document

    if (typeof selector === 'string' || selector instanceof String) {
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

    otherSettings = otherSettings ?? {}

    var settings = {
        method: method,
        headers: {
            'Accept': '*/*',
            ...headers
        },
        ...otherSettings
    }

    method = method ?? 'POST'

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
