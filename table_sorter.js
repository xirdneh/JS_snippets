if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, ''); 
  }
}

var table_sorter=function(){
	function sorter(n){
		this.n=n; this.t; this.b; this.r; this.d; this.p; this.w; this.a=[]; this.l=0; this.hs;
	}
	sorter.prototype.init=function(t,f){
		this.t=document.getElementById(t);
        if (this.t) {
            this.b=this.t.getElementsByTagName('tbody')[0];
            this.hs = this.t.getElementsByTagName('thead')[0];
            this.r=this.b.rows; var l=this.r.length;
            for(var i=0;i<this.hs.rows[0].cells.length; i++){
                var h = this.hs.rows[0].cells[i];
                h.onclick=new Function(this.n+'.work(this.cellIndex)');
            }
            for(var i=0;i<l/2;i++){
                this.a[i]={}; this.l++;
            }
        }
	}
	sorter.prototype.work=function(y){
        for(var i=0;i<this.hs.rows[0].cells.length; i++){
            var h = this.hs.rows[0].cells[i];
            h.className = h.className.indexOf("asc") > -1 || h.className.indexOf("desc") ?
                            h.className.replace(/(asc|desc)/, "") :
                            h.className;
        }
		this.b=this.t.getElementsByTagName('tbody')[0]; this.r=this.b.rows;
		var x=this.hs.rows[0].cells[y],i;
		for(i=0;i<this.l;i++){
			this.a[i].o=i; var v=this.r[i*2].cells[y].firstChild;
			this.a[i].value=(v!=null)?v.innerHTML.trim():''
		}
		if(this.p==y){
			this.a.reverse(); x.className=(this.d)?'asc':'desc';
			this.d=(this.d)?false:true
		}else{
			this.p=y; this.a.sort(compare); x.className='asc'; this.d=false
		}
		var n=document.createElement('tbody');
		for(i=0;i<this.l;i++){
			var r=this.r[(this.a[i].o * 2)].cloneNode(true);
			n.appendChild(r);
            r.className = r.className.indexOf("odd-row-lvl0") > -1 ?
                            r.className.replace("odd-row-lvl0", "") :
                            r.className;
            r.className=(i%2==0)?r.className:r.className+' odd-row-lvl0';
            r = this.r[(this.a[i].o * 2)+1].cloneNode(true);
			n.appendChild(r);
            r.className = r.className.indexOf("odd-row-lvl0") > -1 ?
                            r.className.replace("odd-row-lvl0", "") :
                            r.className;
            r.className=(i%2==0)?r.className:r.className+' odd-row-lvl0';
		}
		this.t.replaceChild(n,this.b);
        setHideShow();
	}
	function compare(f,c){
		f=f.value,c=c.value;
		var i=parseFloat(f.replace(/(\$|\,)/g,'')),n=parseFloat(c.replace(/(\$|\,)/g,''));
		if(!isNaN(i)&&!isNaN(n)){f=i,c=n}
		return (f>c?1:(f<c?-1:0))
	}
	return{sorter:sorter}
}();
