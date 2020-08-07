const fs = require('fs');
const cheerio = require("cheerio")
const axios = require("axios")
const url = require("url")

const getMark = (domain) => {
	return `##  ${domain}  ##\n`
}

module.exports = () => {
	axios.get("https://github.com/").then(async (res) => {
		console.log("github")
		const str = res.data
		const src = findSource(str)
		console.log(src)

		const ips = await findDnsIP(src)

		writeHosts(ips)

	}, (res) => {
		console.log(res)
	})
}

function writeHosts(ips){
	const path = "/etc/hosts"
	let file = fs.readFileSync(path, "utf-8")
	const mark = getMark("github")
	file = file.split(mark)

	const maxLen = ips.reduce((pre, item) => {
		return Math.max(pre, item[1].length)
	}, 0)

	const space = (len) => {
		return new Array(len).join(" ")
	}

	let host = ips.map((kv) => {
		let ip = kv[1]
		let domain = kv[0]
		const dv = maxLen - ip.length
		ip = ip + space(dv)
		const line = ip + space(5) + domain
		return line
	}).join("\n")

	if(file.length === 3){
		// 更新
		file[1] = host + "\n"
		fs.writeFileSync(path, file.join(mark))

	}else{
		// 写入
		host = [host, mark].join("\n") 
		file.push(host)
		fs.writeFileSync(path, file.join(mark))
	}
}

async function findDnsIP(source){
	const all = []
	const now = new Date().getTime() - 20000

	const getIP = (domain, i) => {
		return new Promise((c, e) => {
			const time = now - i * 2000
			console.log(`正在请求${domain}...`)
			axios.get(`https://site.ip138.com/domain/read.do?domain=${domain}&time=${time}`).then((res) => {
				const data = res.data
				if(data.status){
					const ip = data.data[0].ip
					c([domain, ip])
				}else{
					e(`${domain}: 未找到ip`)
				}
			}, (err) => {
				e(`${domain}: 未找到ip`)
			})
		}).catch((err) => {
			console.log(err)
		})
	}

	for(let i = 0;i < source.length; i++){
		const domain = source[i]
		const p = await getIP(domain, i)
		if(p){
			all.push(p)
		}
	}

	return all
}

function findSource(str){
	const sourceMap = {}
	const $ = cheerio.load(str)
	// stylesheet
	const links = $('link[rel="dns-prefetch"]')
	let llen = links.length
	while(llen > 0){
		const link = links[llen - 1]
		const href = $(link).attr("href")
		if(href){
			const host = url.parse(href).hostname
			if(!sourceMap[host]){
				sourceMap[host] = true

			}
		}
		llen--
	}

	const scripts = $('script')
	let slen = scripts.length
	while(slen > 0){
		const script = scripts[slen - 1]
		const src = $(script).attr("src")
		if(src){
			const host = url.parse(src).hostname
			if(!sourceMap[host]){
				sourceMap[host] = true

			}
		}
		slen--
	}
	return Object.keys(sourceMap)
}