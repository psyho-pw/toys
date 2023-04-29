import {Transform} from 'class-transformer'

export function ObjectIdTransform() {
    return Transform(
        ({key, obj}) => {
            const val = obj[key]
            if (Array.isArray(val)) {
                return val.map(v => v.toString())
            } else if (val) {
                return val.toString()
            } else {
                return val
            }
        },
        {
            toClassOnly: true,
        },
    )
}

export function ToBooleanTransform() {
    return Transform(({obj, key}) => obj[key] === 'true')
}

export function ToDateTransform() {
    return Transform(({value}) => (value ? new Date(value + 9 * 60 * 60 * 1000) : null))
}
