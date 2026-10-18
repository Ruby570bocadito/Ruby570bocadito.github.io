"""Extrae el contenido del index.html original (commit 71731b0) a src/content.json.

Así el rediseño usa exactamente los mismos textos, enlaces, cifras e imágenes:
nada se reescribe a mano. Cada texto se guarda como {"k": clave_i18n} si tenía
data-i18n, o como {"h": html_literal} si era un texto fijo.

Uso:  git show 71731b0:index.html > /tmp/orig.html
      python3 scripts/extract-content.py /tmp/orig.html src/content.json
"""
import json
import sys

from bs4 import BeautifulSoup


def node(el):
    if el is None:
        return None
    if el.has_attr("data-i18n"):
        return {"k": el["data-i18n"]}
    inner = el.find(attrs={"data-i18n": True})
    if inner is not None and inner.get_text(strip=True) == el.get_text(strip=True):
        return {"k": inner["data-i18n"]}
    return {"h": el.decode_contents().strip()}


def chips(parent):
    return [dict(node(c), hot="hot" in c.get("class", [])) for c in parent.select(".chip")]


def main(src, dst):
    soup = BeautifulSoup(open(src, encoding="utf-8").read(), "html.parser")
    sec = lambda i: soup.select_one(f"section#{i}")
    out = {}

    out["marquee"] = [b.get_text() for b in soup.select(".mq-track > span")[0].select("b")]

    out["trio"] = [
        {"n": d.select_one(".n").get_text(), "h": node(d.select_one("h3")), "p": node(d.select_one("p"))}
        for d in soup.select(".trio > div")
    ]

    out["facts"] = [{"label": node(f.select_one("span")), "value": node(f.select_one("b"))} for f in soup.select(".fact")]

    out["what"] = [
        {"h": node(c.select_one("h3")), "p": node(c.select_one("p")), "chips": chips(c)}
        for c in sec("focus").select(".wcard")
    ]

    out["stats"] = []
    for s in soup.select(".band .stat"):
        num = s.select_one("[data-count]")
        b = s.select_one("b")
        suffix = b.get_text().replace(num.get_text(), "", 1)
        out["stats"].append({"to": int(num["data-count"]), "suffix": suffix, "label": node(s.select_one(":scope > span"))})

    out["projects"] = []
    for r in sec("projects").select(".prow"):
        imgs = r.select(".shot-body img")
        out["projects"].append({
            "done": "done" in r.select_one(".p-badge").get("class", []),
            "badge": node(r.select_one(".p-badge > span")),
            "name": r.select_one("h3").get_text(),
            "role": node(r.select_one(".p-role")),
            "desc": node(r.select_one(".p-desc")),
            "stack": r.select_one(".p-stack").get_text(),
            "href": r.select_one(".p-link")["href"],
            "view": node(r.select_one(".p-link span")),
            "shot": node(r.select_one(".shot-bar > span")),
            "hover": node(r.select_one(".shot-bar em")),
            "png": imgs[0]["src"], "alt": imgs[0]["alt"], "gif": imgs[1]["src"],
            "metrics": [{"v": m.select_one("b").get_text(), "label": node(m.select_one("span"))} for m in r.select(".p-m")],
        })

    out["more"] = [
        {
            "href": a["href"],
            "name": a.select_one("h4").get_text(),
            "lang": a.select_one(".m-lang").get_text(),
            "p": node(a.select_one("p")),
            "star": node(a.select_one(".m-star")),
        }
        for a in sec("projects").select(".mcard")
    ]

    out["skills"] = [
        {"label": node(r.select_one(".sl b")), "sub": node(r.select_one(".sl span")), "chips": chips(r)}
        for r in sec("skills").select(".srow")
    ]

    out["certs"] = [
        {
            "prep": "prep" in c.get("class", []),
            "title": node(c.select_one("h4")),
            "tag": node(c.select_one(".c-tag")),
            "org": node(c.select_one(".c-org")),
            "p": node(c.select_one(".c-org ~ p")),
        }
        for c in sec("certs").select(".ccard")
    ]

    out["labs"] = [{"h": node(c.select_one("h4")), "p": node(c.select_one("p"))} for c in sec("labs").select(".lcard")]

    ach = sec("achievements").select_one(".ach")
    num = ach.select_one(".ach-num")
    out["achievement"] = {
        "num": num.find(string=True, recursive=False).strip(),
        "small": num.select_one("small").get_text(),
        "h": node(ach.select_one("h3")),
        "p": node(ach.select_one("h3 ~ p")),
        "tags": [node(t) for t in ach.select(".tags .chip")],
    }

    out["education"] = [
        {
            "when": node(e.select_one(".e-when")),
            "title": node(e.select_one("h4")),
            "org": node(e.select_one(".e-org")),
            "p": node(e.select_one(".e-org ~ p")),
            "tag": node(e.select_one(".c-tag")),
        }
        for e in sec("education").select(".edu-item")
    ]

    out["now"] = [
        {"s": node(d.select_one("summary > span:first-child")), "b": node(d.select_one(".a-body"))}
        for d in sec("focus-now").select("details")
    ]

    c = sec("contact")
    out["contact"] = {
        "email": c.select_one("[data-copy]")["data-copy"],
        "links": [{"href": a["href"], "label": a.get_text(strip=True)} for a in c.select(".contact-links a")],
    }

    f = soup.select_one("footer")
    out["footer"] = {
        "brand": f.select_one(".f-brand a").get_text(strip=True),
        "cols": [
            {
                "title": node(col.select_one("span")),
                "links": [{"href": a["href"], "label": node(a), "ext": a.get("target") == "_blank", "download": a.get("download")} for a in col.select("a")],
            }
            for col in f.select(".f-col")
        ],
        "copy": f.select_one(".f-bottom span").get_text(),
    }

    out["linkedin"] = soup.select_one('a[href*="linkedin"]')["href"]
    out["github"] = soup.select_one('a[href="https://github.com/Ruby570bocadito"]')["href"]

    json.dump(out, open(dst, "w", encoding="utf-8"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
