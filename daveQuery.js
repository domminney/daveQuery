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
        this.forEach((elem) => {
            elem.classList.remove(cls)
        })
        return this
    }

    addClass(cls) {
        this.forEach((elem) => {
            elem.classList.add(cls)
        })
        return this
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

    remove() {
        this.forEach((elem) => {
            elem.remove()
        })
    }

    // attributes

    attr(attr, val) {
        if (typeof val === 'undefined') {
            return this[0].elem.getAttribute(attr)
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
        return this[0].nextElementSibling
    }

    prev() {
        return this[0].previousElementSibling
    }

    firstChild() {
        return this[0].firstElementChild
    }

    lastChild() {
        return this[0].lastElementChild
    }


    // content

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

}

var $ = function (selector) {

    if (typeof selector === 'string' || selector instanceof String) {
        if (selector.startsWith("<")) {
            // is html
            var doc = new DOMParser().parseFromString(selector, "text/html")
            return new ElementCollection(...doc.body.childNodes)
        }
        // is selector string
        return new ElementCollection(...document.querySelectorAll(selector))
    }
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

    if (method === 'POST') {
        settings.headers['Content-Type'] = 'application/json'
    }

    if (body) {
        settings.body = JSON.stringify(body)
    }

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
