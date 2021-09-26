import got from 'got'
import { JSDOM, } from 'jsdom'

const metaCrawler = (url) => {

    return new Promise(async (resolve, reject) => {

        if (!url) {
            reject('URL Required!!')
        }
        if (!/http[s]?:\/\/(?:[a-z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-f][0-9a-f]))+/.test(url)) {
            reject('URL is not valid!!')
        }
        try {
            const response = await got.get(url)

            const { window: { document } } = new JSDOM(response.body)

            const metaNodes = Array.from(document.querySelectorAll('head meta'))

            const metaArr = metaNodes.map(meta => {

                const { content, charset, property, name } = meta.attributes

                return {
                    name: property?.value || name?.value || charset?.value || meta.attributes['http-equiv']?.value,
                    content: content?.value || null,
                    html: meta?.outerHTML
                }

            })

            resolve(metaArr)

        } catch (e) {
            reject(e.toString())
        }





    })
}

export default metaCrawler