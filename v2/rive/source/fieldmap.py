import re,json,sys
reg=json.load(open('reg.json'))
s=open(sys.argv[1]).read()
i=s.index('static int propertyFieldId(int propertyKey)')
body=s[i:i+200000]
body=body[:body.index('\n  }\n',100)] if False else body
ft={}
pending=[]
for line in body.split('\n'):
    m=re.search(r'case (\w+)Base::(\w+)PropertyKey:',line)
    if m: pending.append((m.group(1),m.group(2))); continue
    m=re.search(r'return Core(\w+)Type::id;',line)
    if m:
        for c,p in pending:
            cl=reg.get(c)
            for k,v in cl['props'].items():
                if v[0]==p: ft[int(k)]=m.group(1)
        pending=[]
    if 'default:' in line: break
json.dump(ft,open('fieldtypes.json','w'))
print(len(ft), set(ft.values()))
