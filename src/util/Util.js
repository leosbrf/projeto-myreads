export function debounce(a, b, c) {
    let d;
    let e;
    return function (...args) {
        function h() {
            // eslint-disable-next-line
            d = null, c || (e = a.apply(f, g))
        }
        var f = this;
        var g = args;
        // eslint-disable-next-line
        return clearTimeout(d), d = setTimeout(h, b), c && !d && (e = a.apply(f, g)), e
    };
}

export function shelfMapper(shelf) {

    switch (shelf) {
        case 'currentlyReading':
            return 'Currently Reading'
        case 'wantToRead':
            return 'Want to Read'
        case 'read':
            return 'Read'
        default:
            break;
    }

}

