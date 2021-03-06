/*
# Copyrightę 2008 Felipe Nascimento de Muora, SpringerIT.com
# 
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

loading= false;
xmlLoading= false;
xmlStayLoading= null;
stayLoading= null;
dT= 0;
dL= 0;
function newId(pre, pos)
{
	var letras= new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y', 'Z');
	if(pre)
		var id= pre;
	else
		var id= letras[parseInt((Math.random() * 100)/4)];
	var dt= new Date();
	id+= '_'+dt.getFullYear();
	id+= ''+dt.getMonth();
	id+= ''+dt.getDate();
	id+= ''+dt.getHours();
	id+= ''+dt.getMinutes();
	id+= ''+dt.getSeconds();
	id+= ''+dt.getMilliseconds();
	if(pos)
		id+= pos;
	return id;
}
function Ajax()
{
	var ajaxObj;
	try
	{
		ajaxObj= new XMLHttpRequest();
		ajaxObj.overrideMimeType("text/xml");
	}
	catch (eee)
	{
		try
		{
			ajaxObj= new ActiveXObject("Msxm12.XMLHTTP");
		}
		catch (ee)
		{
			try
			{
				ajaxObj=new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (e)
			{
				ajaxObj=false;
			}
		}
	}
	this.url = false;
	this.setURL= function(u)
	{
		this.url= u;
	}
	this.post= false;
	this.get= false;
	this.addPost= function (name, value)
	{
		if(this.post != false)
			this.post+='&'+name+'='+value;
		else
			this.post= name+'='+value;
	}
	this.addGet= function (name, value)
	{
		if(this.get != false)
			this.get+='&'+name+'='+value;
		else
			this.get= name+'='+value;
	}
	this.returnType= 'TEXT';
	this.setReturnType= function(rt)
	{
		this.returnType= rt;
	}
	this.onError = false;
	this.callBack = function(cb, obj)
	{
		return cb;
	}
	this.onStateChange= function(s, obj)
	{
		return s;
	}
	this.call = function(url, bAsync)
	{
		if(url)
			this.url= url;
		if(this.get != false)
		{
			if(this.url.indexOf('?') == -1)
				this.url+= '?';
			else
				this.url+= '&';
			this.url+= this.get;
		}
		bAsync= (bAsync)? false: true;
		this.ajax.open("GET", this.url, bAsync);
		this.async = bAsync;
		this.ajax.setRequestHeader("Cache-Control", "no-store, no-cache, must-revalidate");
		this.ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		this.stateChange= function (event)
		{
			for(var x in z_ajaxOnreadyStateChangeGlobalList)
			{
				if(z_ajaxOnreadyStateChangeGlobalList[x].ajax.readyState == 4)
				{
					if(z_ajaxOnreadyStateChangeGlobalList[x].ajax.status == 200)
					{
						if(z_ajaxOnreadyStateChangeGlobalList[x].returnType=='XML')
						{
							z_ajaxOnreadyStateChangeGlobalList[x].callBack(z_ajaxOnreadyStateChangeGlobalList[x].ajax.responseXML, z_ajaxOnreadyStateChangeGlobalList[x]);
						}else
							z_ajaxOnreadyStateChangeGlobalList[x].callBack(z_ajaxOnreadyStateChangeGlobalList[x].ajax.responseText, z_ajaxOnreadyStateChangeGlobalList[x]);
						delete z_ajaxOnreadyStateChangeGlobalList[x];
					}else{
							if(z_ajaxOnreadyStateChangeGlobalList[x].onError != false)
							{
								if(z_ajaxOnreadyStateChangeGlobalList[x].onError(z_ajaxOnreadyStateChangeGlobalList[x].ajax.status, z_ajaxOnreadyStateChangeGlobalList[x]))
									z_ajaxOnreadyStateChangeGlobalList[x].callBack(false);
							}else
								z_ajaxOnreadyStateChangeGlobalList[x].callBack(false);
						 }
					delete z_ajaxOnreadyStateChangeGlobalList[x];
				}else{
						if(z_ajaxOnreadyStateChangeGlobalList[x] != null && z_ajaxOnreadyStateChangeGlobalList[x] != false)
							z_ajaxOnreadyStateChangeGlobalList[x].onStateChange(z_ajaxOnreadyStateChangeGlobalList[x].ajax.readyState, z_ajaxOnreadyStateChangeGlobalList[x]);
					 }
			}
			return;
		}
		try
		{
			this.ajax.onreadystatechange= this.stateChange;
		}catch(error){
						this.ajax.onreadystatechange= this.stateChange;
					 }
		var ajaxArrayPosition= newId('z', 'AjaxCall');
		if(!this.post)
			this.post= '';
		while(z_ajaxOnreadyStateChangeGlobalList[ajaxArrayPosition])
		{
			ajaxArrayPosition+= '_';
		}
		z_ajaxOnreadyStateChangeGlobalList[ajaxArrayPosition]= this;
		this.ajax.send(this.post);	
		if(!this.async && navigator.userAgent.indexOf('Firefox') != -1)
		{
			var x = ((this.returnType=='XML')? this.ajax.responseXML: this.ajax.responseText)
			this.callBack(x, this);
		}
	}
	this.ajax= ajaxObj;
	return this;
}
z_ajaxOnreadyStateChangeGlobalList= new Array();
function ajaxCall(url, func, dados, load, id)
{
	if(!id)
	{
		dt= new Date();
		id= dt.getTime();
	}
	if(loading == true)
	{
		stayLoading= setTimeout("ajaxCall(\""+url+"\", \""+func+"\", \""+dados+"\", \""+load+"\", \""+id+"\")", 500);
		return true;
	}else{
			stayLoading= false;
			delete stayLoading;
		 }
	loading= true;
	ajaxObj= new Ajax();
	ajaxObj= ajaxObj.ajax;
	ajaxObj.open("POST", url, true);
	ajaxObj.setRequestHeader("Cache-Control", "no-store, no-cache, must-revalidate");
	ajaxObj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	ajaxObj.onreadystatechange =  function ajaxObjStateChange()
								  {
									if(load)
										eval(load(ajaxObj.readyState));
									if(ajaxObj.readyState == 4)
									{
										loading= false;
										alert(ajaxObj);
										if(func)
											eval(func(ajaxObj.responseText));
									}
								  }
	if(!dados)
		dados= '';
	ajaxObj.send(dados);
	return false;
}