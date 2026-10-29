import re,os,json,sys
root=sys.argv[1]
classes={}
for dp,_,fs in os.walk(root):
    for f in fs:
        if not f.endswith('_base.hpp'): continue
        s=open(os.path.join(dp,f)).read()
        m=re.search(r'class (\w+)Base\s*:\s*public ([\w:]+)',s)
        if not m:
            m2=re.search(r'class (\w+)Base\b',s)
            if not m2: continue
            name=m2.group(1); sup=None
        else:
            name=m.group(1); sup=m.group(2)
        sup_m=re.search(r'typedef (\w+) Super;',s)
        if sup_m: sup=sup_m.group(1)
        tk=re.search(r'static const uint16_t typeKey = (\d+);',s)
        props={}
        for pm in re.finditer(r'static const uint16_t (\w+)PropertyKey = (\d+);',s):
            props[int(pm.group(2))]=[pm.group(1),None]
        for dm in re.finditer(r'case (\w+)PropertyKey:[^;]*?Core(\w+)Type::deserialize',s,re.S):
            for k,v in props.items():
                if v[0]==dm.group(1): v[1]=dm.group(2)
        classes[name]={'typeKey':int(tk.group(1)) if tk else None,'super':sup,'props':props}
json.dump(classes,open('reg.json','w'),indent=0)
print(len(classes))
