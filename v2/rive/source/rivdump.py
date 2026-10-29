import json,struct,sys
reg=json.load(open('reg.json')); ft={int(k):v for k,v in json.load(open('fieldtypes.json')).items()}
tk2name={c['typeKey']:n for n,c in reg.items() if c['typeKey'] is not None}
pk2name={}
for n,c in reg.items():
    for k,v in c['props'].items(): pk2name[int(k)]=v[0]
class R:
    def __init__(s,b): s.b=b; s.i=0
    def vu(s):
        r=0;sh=0
        while True:
            x=s.b[s.i]; s.i+=1; r|=(x&0x7f)<<sh; sh+=7
            if not x&0x80: return r
    def end(s): return s.i>=len(s.b)
def dump(path,limit=10**9):
    b=open(path,'rb').read(); r=R(b)
    assert b[:4]==b'RIVE'; r.i=4
    print('version',r.vu(),r.vu(),'fileid',r.vu())
    keys=[]
    while True:
        k=r.vu()
        if k==0: break
        keys.append(k)
    toc={}
    cur=0;bit=8
    for k in keys:
        if bit==8: cur=struct.unpack_from('<I',b,r.i)[0]; r.i+=4; bit=0
        toc[k]=(cur>>bit)&3; bit+=2
    idx=0; n=0
    while not r.end() and n<limit:
        t=r.vu(); name=tk2name.get(t,'?%d'%t)
        props=[]
        while True:
            k=r.vu()
            if k==0: break
            typ=ft.get(k)
            if typ is None:
                f=toc.get(k); typ={0:'Uint',1:'String',2:'Double',3:'Color'}[f]
            if typ in('Uint','Id'): v=r.vu()
            elif typ=='Int': u=r.vu(); v=(u>>1)^-(u&1)
            elif typ=='Double': v=round(struct.unpack_from('<f',b,r.i)[0],3); r.i+=4
            elif typ=='Color': v=hex(struct.unpack_from('<I',b,r.i)[0]); r.i+=4
            elif typ=='Bool': v=b[r.i]; r.i+=1
            elif typ in('String','Bytes'):
                L=r.vu(); v=b[r.i:r.i+L]; r.i+=L
                v=v.decode('utf8','replace') if typ=='String' else '<%d bytes>'%L
            props.append('%s=%s'%(pk2name.get(k,k),v))
        print(n,name,' '.join(props)); n+=1
dump(sys.argv[1], int(sys.argv[2]) if len(sys.argv)>2 else 10**9)
