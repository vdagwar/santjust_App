$(document).ready(function () {

    $("#viewReport").click(function () {
        if ($("#start").val() != "" && $("#end").val() != "") {
            var entity = {};
            entity.new_startdate = $("#start").val();
            entity.new_enddate = $("#end").val();
            $body = $("body");
            $body.addClass("loading");

            $.ajax({
                type: "GET",
                contentType: "application/json; charset=utf-8",
                datatype: "json",
                url: window.parent.Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/new_reportdataSet?$select=new_reportdataId,new_reportdata_Annotations/NoteText&$expand=user_new_reportdata,new_reportdata_Annotations",
                beforeSend: function (XMLHttpRequest) {
                    XMLHttpRequest.setRequestHeader("Accept", "application/json");
                },
                async: true,
                success: function (data, textStatus, xhr) {
                    var results = data.d.results;

                    var new_reportdataId = results[0].new_reportdataId;

                    $.ajax({
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        datatype: "json",
                        url: window.parent.Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/new_reportdataSet(guid'" + new_reportdataId + "')",
                        data: JSON.stringify(entity),
                        beforeSend: function (XMLHttpRequest) {
                            XMLHttpRequest.setRequestHeader("Accept", "application/json");
                            XMLHttpRequest.setRequestHeader("X-HTTP-Method", "MERGE");
                        },
                        async: true,
                        success: function (data, textStatus, xhr) {
                            setTimeout(function () {
                                var noteid = new_reportdataId;
                                getNote(noteid);
                            }, 15000)

                        },
                        error: function (xhr, textStatus, errorThrown) {
                            $body.removeClass("loading");
                            alert(textStatus + " " + errorThrown);
                        }
                    });

                    // var new_reportdata_Annotations_NoteText = results[i].new_reportdata_Annotations.NoteText;
                },
                error: function (xhr, textStatus, errorThrown) {
                    alert(textStatus + " " + errorThrown);
                }
            });


        } else {
            $body.removeClass("loading");
            alert("Please select start date and end date first");
        }
    })

    function getNote(noteid) {
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            url: window.parent.Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/new_reportdataSet(guid'" + noteid + "')?$select=new_reportdata_Annotations/NoteText&$expand=new_reportdata_Annotations",
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            async: true,
            success: function (data, textStatus, xhr) {
                var result = data.d;

                var NoteText = null;

                if (result.new_reportdata_Annotations.results[0].NoteText != null) {
                    NoteText = result.new_reportdata_Annotations.results[0].NoteText;
                }


                if (result.new_reportdata_Annotations.results[1].NoteText != null) {
                    if (NoteText == null) {
                        NoteText = NoteText + result.new_reportdata_Annotations.results[1].NoteText;
                    } else {
                        NoteText = NoteText + "," + result.new_reportdata_Annotations.results[1].NoteText;
                    }
                }

                if (result.new_reportdata_Annotations.results[2].NoteText != null) {
                    if (NoteText == null) {
                        NoteText = NoteText + result.new_reportdata_Annotations.results[2].NoteText;
                    } else {
                        NoteText = NoteText + "," + result.new_reportdata_Annotations.results[2].NoteText;
                    }

                }

                if (result.new_reportdata_Annotations.results[3].NoteText != null) {
                    if (NoteText == null) {
                        NoteText = NoteText + result.new_reportdata_Annotations.results[3].NoteText;
                    } else {
                        NoteText = NoteText + "," + result.new_reportdata_Annotations.results[3].NoteText;
                    }

                }

                if (NoteText != null) {
                    NoteText = "[" + NoteText + "]"
                }

                //var jsondata1 = "[" + NoteText +"," +result.new_reportdata_Annotations.results[1].NoteText+"," +result.new_reportdata_Annotations.results[2].NoteText+"," +result.new_reportdata_Annotations.results[3].NoteText+"]";

                if (NoteText != null) {
                    createGrid(NoteText);
                } else {
                    alert("No record found");
                    $body.removeClass("loading");
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                $body.removeClass("loading");
                alert(textStatus + " " + errorThrown);
            }
        });

    }


    function createGrid(jData) {
        var products = JSON.parse(jData);
        $body.removeClass("loading");
        $("#grid").kendoGrid({
            //Added a template to the toolbar
            toolbar: [
              { template: kendo.template($("#template").html()) }
            ],
            dataSource: {
                data: products,
                schema: {
                    model: {
                        fields: {
                            Name: { type: "string" },
                            EntityName: { type: "string" },
                            Territory: { type: "string" },
                            CompanyName: { type: "string" },
                            address: { type: "string" },
                            IsActive: { type: "string" },
                            Owner: { type: "string" },
                            CreateDate: { type: "string" }
                        }
                    }
                },
                pageSize: 20
            },
            height: 550,
            sortable: true,
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },
            columns: [
                         "Name",
                         { field: "EntityName", title: "Entity Name" },
                         { field: "Territory", title: "Territory" },
                         { field: "CompanyName", title: "Company Name" },
                         { field: "address", title: "Address" },
                         { field: "IsActive", title: "Active/Inactive" },
                         { field: "Owner", title: "Owner" },
                         { field: "CreateDate" }
            ]
        });
        $(".search-label").hide();
        //Searching the Grid by the value of the textbox
        $("#btnSearch").click(function () {
            var searchValue = $('#searchBox').val();
            //Setting the filter of the Grid
            $("#grid").data("kendoGrid").dataSource.filter({
                logic: "or",
                filters: [
                  {
                      field: "Name",
                      operator: "contains",
                      value: searchValue
                  },
                  {
                      field: "EntityName",
                      operator: "contains",
                      value: searchValue
                  },
                  {
                      field: "Territory",
                      operator: "contains",
                      value: searchValue
                  },
                  {
                      field: "CompanyName",
                      operator: "contains",
                      value: searchValue
                  },
                  {
                      field: "address",
                      operator: "contains",
                      value: searchValue
                  },
                  {
                      field: "CreateDate",
                      operator: "contains",
                      value: searchValue
                  }
                ]
            });
        });

        //Searching the Grid by the value of the textbox
        $("#btnSearch").click(function () {
            var searchValue = $('#searchBox').val();
            //Setting the filter of the Grid
            $("#grid").data("kendoGrid").dataSource.filter({
                logic: "or",
                filters: [
                  {
                      field: "Name",
                      operator: "contains",
                      value: searchValue
                  },
                  {
                      field: "CreateDate",
                      operator: "contains",
                      value: searchValue
                  },
                  {
                      field: "IsActive",
                      operator: "contains",
                      value: searchValue
                  },
                   {
                       field: "emailaddress",
                       operator: "contains",
                       value: searchValue
                   }
                ]
            });
        });

        //Clearing the filter
        $("#btnReset").click(function () {
            $("#grid").data("kendoGrid").dataSource.filter({});
        });

        $('#searchBox').keypress(function (e) {
            if (e.which == 13) {//Enter key pressed
                $('#btnSearch').click();//Trigger search button click event
            }
        });

        $('#grid .k-grid-content.k-auto-scrollable table[role="grid"]').attr('id', 'myTable');

        $("#export").show();
        $("#export").insertAfter("#btnReset");
    }


});

$("#viewReport").click(function () {

    var entity = {};
    entity.new_startdate = "4/9/2017";
    entity.new_enddate = "4/9/2017";
    $body = $("body");
    $body.addClass("loading");

    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        url: window.parent.Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/new_reportdataSet?$select=new_reportdataId,new_reportdata_Annotations/NoteText&$expand=user_new_reportdata,new_reportdata_Annotations",
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("Accept", "application/json");
        },
        async: true,
        success: function (data, textStatus, xhr) {
            var results = data.d.results;

            var new_reportdataId = results[0].new_reportdataId;

            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                datatype: "json",
                url: window.parent.Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/new_reportdataSet(guid'" + new_reportdataId + "')",
                data: JSON.stringify(entity),
                beforeSend: function (XMLHttpRequest) {
                    XMLHttpRequest.setRequestHeader("Accept", "application/json");
                    XMLHttpRequest.setRequestHeader("X-HTTP-Method", "MERGE");
                },
                async: true,
                success: function (data, textStatus, xhr) {
                    setTimeout(function () {
                        var noteid = new_reportdataId;
                        getNote(noteid);
                    }, 18000)

                },
                error: function (xhr, textStatus, errorThrown) {
                    $body.removeClass("loading");
                    alert(textStatus + " " + errorThrown);
                }
            });

            // var new_reportdata_Annotations_NoteText = results[i].new_reportdata_Annotations.NoteText;
        },
        error: function (xhr, textStatus, errorThrown) {
            alert(textStatus + " " + errorThrown);
        }
    });

})


$("#viewReport").click(function () {
    if ($("#start").val() != "" && $("#end").val() != "") {
        var entity = {};
        entity.new_startdate = $("#start").val();
        entity.new_enddate = $("#end").val();
        $body = $("body");
        $body.addClass("loading");

        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            url: window.parent.Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/new_reportdataSet?$select=new_reportdataId,new_reportdata_Annotations/NoteText&$expand=user_new_reportdata,new_reportdata_Annotations",
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            async: true,
            success: function (data, textStatus, xhr) {
                var results = data.d.results;

                var new_reportdataId = results[0].new_reportdataId;

                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    datatype: "json",
                    url: window.parent.Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/new_reportdataSet(guid'" + new_reportdataId + "')",
                    data: JSON.stringify(entity),
                    beforeSend: function (XMLHttpRequest) {
                        XMLHttpRequest.setRequestHeader("Accept", "application/json");
                        XMLHttpRequest.setRequestHeader("X-HTTP-Method", "MERGE");
                    },
                    async: true,
                    success: function (data, textStatus, xhr) {
                        setTimeout(function () {
                            var noteid = new_reportdataId;
                            getNote(noteid);
                        }, 18000)

                    },
                    error: function (xhr, textStatus, errorThrown) {
                        $body.removeClass("loading");
                        alert(textStatus + " " + errorThrown);
                    }
                });

                // var new_reportdata_Annotations_NoteText = results[i].new_reportdata_Annotations.NoteText;
            },
            error: function (xhr, textStatus, errorThrown) {
                alert(textStatus + " " + errorThrown);
            }
        });


    } else {
        $body.removeClass("loading");
        alert("Please select start date and end date first");
    }
})
$(document).ready(function () {
    function startChange() {
        var startDate = start.value(),
        endDate = end.value();

        if (startDate) {
            startDate = new Date(startDate);
            startDate.setDate(startDate.getDate());
            end.min(startDate);
        } else if (endDate) {
            start.max(new Date(endDate));
        } else {
            endDate = new Date();
            start.max(endDate);
            end.min(endDate);
        }
    }

    function endChange() {
        var endDate = end.value(),
        startDate = start.value();

        if (endDate) {
            endDate = new Date(endDate);
            endDate.setDate(endDate.getDate());
            start.max(endDate);
        } else if (startDate) {
            end.min(new Date(startDate));
        } else {
            endDate = new Date();
            start.max(endDate);
            end.min(endDate);
        }
    }

    var start = $("#start").kendoDatePicker({
        change: startChange
    }).data("kendoDatePicker");

    var end = $("#end").kendoDatePicker({
        change: endChange
    }).data("kendoDatePicker");

    start.max(end.value());
    end.min(start.value());
});


var tableToExcel = (function () {
    var uri = 'data:application/vnd.ms-excel;base64,'
    , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
    , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
    , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
    return function (table, name) {
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
        window.location.href = uri + base64(format(template, ctx))
    }
})()

function myfunction() {
    var xml = "" +
"<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\"><s:Body><Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\"><request xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\"><a:Parameters xmlns:b=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\"><a:KeyValuePairOfstringanyType><b:key>Target</b:key><b:value i:type=\"a:EntityReference\"><a:Id>1c54dadd-f91b-e511-a5ca-c4346bacae20</a:Id><a:LogicalName>new_testentity</a:LogicalName><a:Name i:nil=\"true\"/></b:value></a:KeyValuePairOfstringanyType></a:Parameters><a:RequestId i:nil=\"true\"/><a:RequestName>new_testentity</a:RequestName></request></Execute></s:Body></s:Envelope>" +
"";

    var xmlHttpRequest = new XMLHttpRequest();

    xmlHttpRequest.open("POST", Xrm.Page.context.getClientUrl() + "/XRMServices/2011/Organization.svc/web", false);
    xmlHttpRequest.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
    xmlHttpRequest.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
    xmlHttpRequest.setRequestHeader("Accept", "application/xml, text/xml, */*");
    xmlHttpRequest.setRequestHeader("Content-Length", xml.length);
    xmlHttpRequest.send(xml);

    var resultXml = xmlHttpRequest.responseText;
    alert(resultXml);
}


function SalesOrderRelationshipWithHomeClub() {
    var recordId = Xrm.Page.data.entity.getId();
    recordId = recordId.replace(/[{}]/g, "");
    if (recordId != "") {
        var homeClub = Xrm.Page.getAttribute("vtv_clubcode").getValue();
        if (homeClub != null) {
            var homeClubId = Xrm.Page.getAttribute("vtv_clubcode").getValue()[0].id;
            homeClubId = homeClubId.replace(/[{}]/g, "");
            if (homeClubId != null) {
                var association = {
                    "@odata.id": Xrm.Page.context.getClientUrl() + "/api/data/v8.2/vtv_clubs(" + homeClubId + ")"
                };
                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    datatype: "json",
                    url: Xrm.Page.context.getClientUrl() + "/api/data/v8.2/salesorders(" + recordId + ")/vtv_contract_club_involved/$ref",
                    data: JSON.stringify(association),
                    beforeSend: function (XMLHttpRequest) {
                        XMLHttpRequest.setRequestHeader("OData-MaxVersion", "4.0");
                        XMLHttpRequest.setRequestHeader("OData-Version", "4.0");
                        XMLHttpRequest.setRequestHeader("Accept", "application/json");
                    },
                    async: true,
                    success: function (data, textStatus, xhr) {
                        Xrm.Page.ui.controls.get("ClubsInvolved").refresh();
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        //Xrm.Utility.alertDialog(textStatus + " " + errorThrown);
                    }
                });
            }
        }
    } else {
        setTimeout(function () {
            SalesOrderRelationshipWithHomeClub();
        }, 1000)
    }
}

var opportunityId = window.parent.Xrm.Page.data.entity.getId();
var checknewaccount = window.parent.Xrm.Page.getAttribute("vtv_opportunityguestreferral").getValue();
if(opportunityId == "" ||opportunityId == undefined && checknewaccount !=null)
{
	checknewaccount = checknewaccount[0].id;
	
	$.ajax({
    type: "GET",
    contentType: "application/json; charset=utf-8",
    datatype: "json",
    url: Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/OpportunitySet(guid'"+checknewaccount+"')?$expand=transactioncurrency_opportunity",
  
    beforeSend: function (XMLHttpRequest) {
        XMLHttpRequest.setRequestHeader("Accept", "application/json");
    },
    async: true,
    success: function (data, textStatus, xhr) {
    
        var result = data.d;
        var OpportunityId = result.OpportunityId;
        var fieldName = "vtv_clubid"; var entityType ="vtv_club"; var fieldId = result.vtv_ClubId.Id; var name = result.vtv_ClubId.Name
		try {
	        if (result.vtv_ClubId.Id != null)
		    {
		       var lookupValue = new Array();
		       lookupValue[0] = new Object();
		       lookupValue[0].id = fieldId;
		       lookupValue[0].name = name;
		       lookupValue[0].entityType = entityType;
		       if (lookupValue[0].id != null)
			   {
		           Xrm.Page.getAttribute(fieldName).setValue(lookupValue);
		       }
		    }
	    }
        catch (e) {
				alert(e.message);
		}
		
	var sourceFieldName = "vtv_sourcecodeid";
    try {
	        if (result.vtv_SourceCodeId.Id != null)
		    {
		       var lookupValue = new Array();
		       lookupValue[0] = new Object();
		       lookupValue[0].id = result.vtv_SourceCodeId.Id;
		       lookupValue[0].name = result.vtv_SourceCodeId.Name;
		       lookupValue[0].entityType = "vtv_marketingsource";
		       if (lookupValue[0].id != null)
			   {
		           Xrm.Page.getAttribute(sourceFieldName).setValue(lookupValue);
		       }
		    }
	    }
        catch (e) {
				alert(e.message);
		}
		debugger;
		if (result.vtv_Type.Value != null){
			Xrm.Page.getAttribute("vtv_type").setValue(result.vtv_Type.Value);
		}
    	
    },
    error: function (xhr, textStatus, errorThrown) {
        alert(textStatus + " " + errorThrown);
    }
});
}

function RelatedContract() {
    var recordId = Xrm.Page.data.entity.getId();
    if (recordId == "") {
        var parentContract = Xrm.Page.getAttribute("vtv_parentcontract").getValue();
        if (parentContract != null) {
            var parentContractId = Xrm.Page.getAttribute("vtv_parentcontract").getValue()[0].id;
            parentContractId = parentContractId.replace(/[{}]/g, "");
            if (parentContractId != null) {
                $.ajax({
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    datatype: "json",
                    url: Xrm.Page.context.getClientUrl() + "/api/data/v8.2/salesorders(" + parentContractId + ")",
                    beforeSend: function (XMLHttpRequest) {
                        XMLHttpRequest.setRequestHeader("OData-MaxVersion", "4.0");
                        XMLHttpRequest.setRequestHeader("OData-Version", "4.0");
                        XMLHttpRequest.setRequestHeader("Accept", "application/json");
                        XMLHttpRequest.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
                    },
                    async: true,
                    success: function (data, textStatus, xhr) {
                        var result = data;
                        debugger;
                        Xrm.Page.getAttribute("name").setValue(result.name);
                        var sourceFieldName = "pricelevelid";
                        try {
                            if (result._pricelevelid_value != null) {
                                var lookupValue = new Array();
                                lookupValue[0] = new Object();
                                lookupValue[0].id = result._pricelevelid_value;
                                lookupValue[0].name = result["_pricelevelid_value@OData.Community.Display.V1.FormattedValue"];
                                lookupValue[0].entityType = "pricelevel";
                                if (lookupValue[0].id != null) {
                                    Xrm.Page.getAttribute(sourceFieldName).setValue(lookupValue);
                                }
                            }
                        }
                        catch (e) {
                            alert(e.message);
                        }


                        var isPriceLocked = result.ispricelocked;
                        if (isPriceLocked != null) {
                            Xrm.Page.getAttribute("ispricelocked").setValue(isPriceLocked);
                        }

                        //currency
                        sourceFieldName = "transactioncurrencyid";
                        try {
                            if (result._transactioncurrencyid_value != null) {
                                var lookupValue = new Array();
                                lookupValue[0] = new Object();
                                lookupValue[0].id = result._transactioncurrencyid_value;
                                lookupValue[0].name = result["_transactioncurrencyid_value@OData.Community.Display.V1.FormattedValue"];
                                lookupValue[0].entityType = "transactioncurrency";
                                if (lookupValue[0].id != null) {
                                    Xrm.Page.getAttribute(sourceFieldName).setValue(lookupValue);
                                }
                            }
                        }
                        catch (e) {
                            alert(e.message);
                        }


                        //contact lookup vcalue
                        sourceFieldName = "customerid";
                        try {
                            if (result._customerid_value != null) {
                                var lookupValue = new Array();
                                lookupValue[0] = new Object();
                                lookupValue[0].id = result._customerid_value;
                                lookupValue[0].name = result["_customerid_value@OData.Community.Display.V1.FormattedValue"];
                                lookupValue[0].entityType = "contact";
                                if (lookupValue[0].id != null) {
                                    Xrm.Page.getAttribute(sourceFieldName).setValue(lookupValue);
                                }
                            }
                        }
                        catch (e) {
                            alert(e.message);
                        }

                        //club lookup value
                        sourceFieldName = "vtv_clubcode";
                        try {
                            if (result._vtv_clubcode_value != null) {
                                var lookupValue = new Array();
                                lookupValue[0] = new Object();
                                lookupValue[0].id = result._vtv_clubcode_value;
                                lookupValue[0].name = result["_vtv_clubcode_value@OData.Community.Display.V1.FormattedValue"];
                                lookupValue[0].entityType = "vtv_club";
                                if (lookupValue[0].id != null) {
                                    Xrm.Page.getAttribute(sourceFieldName).setValue(lookupValue);
                                }
                            }
                        }
                        catch (e) {
                            alert(e.message);
                        }

                        //type of contact optionset value
                        var typeOfContact = result.vtv_typeofcontract;
                        if (typeOfContact != null) {
                            Xrm.Page.getAttribute("vtv_typeofcontract").setValue(typeOfContact);
                        }

                        //type optionset value
                        var type = result.vtv_type;
                        if (type != null) {
                            Xrm.Page.getAttribute("vtv_type").setValue(type);
                        }

                        //membership term optionset value
                        var membershipTerm = result.vtv_membershipterm;
                        if (membershipTerm != null) {
                            Xrm.Page.getAttribute("vtv_membershipterm").setValue(membershipTerm);
                        }

                    },
                    error: function (xhr, textStatus, errorThrown) {
                        Xrm.Utility.alertDialog(textStatus + " " + errorThrown);
                    }
                });
            }
        }
    } else {

    }
} function RelatedContract() {
    debugger;
    var recordId = Xrm.Page.data.entity.getId();
    if (recordId == "") {
        var parentContract = Xrm.Page.getAttribute("vtv_parentcontract").getValue();
        if (parentContract != null) {
            var parentContractId = Xrm.Page.getAttribute("vtv_parentcontract").getValue()[0].id;
            parentContractId = parentContractId.replace(/[{}]/g, "");
            if (parentContractId != null) {
                $.ajax({
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    datatype: "json",
                    url: Xrm.Page.context.getClientUrl() + "/api/data/v8.2/salesorders(" + parentContractId + ")",
                    beforeSend: function (XMLHttpRequest) {
                        XMLHttpRequest.setRequestHeader("OData-MaxVersion", "4.0");
                        XMLHttpRequest.setRequestHeader("OData-Version", "4.0");
                        XMLHttpRequest.setRequestHeader("Accept", "application/json");
                        XMLHttpRequest.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
                    },
                    async: true,
                    success: function (data, textStatus, xhr) {
                        var result = data;
                        debugger;
                        Xrm.Page.getAttribute("name").setValue(result.name);
                        var sourceFieldName = "pricelevelid";
                        try {
                            if (result._pricelevelid_value != null) {
                                var lookupValue = new Array();
                                lookupValue[0] = new Object();
                                lookupValue[0].id = result._pricelevelid_value;
                                lookupValue[0].name = result["_pricelevelid_value@OData.Community.Display.V1.FormattedValue"];
                                lookupValue[0].entityType = "pricelevel";
                                if (lookupValue[0].id != null) {
                                    Xrm.Page.getAttribute(sourceFieldName).setValue(lookupValue);
                                }
                            }
                        }
                        catch (e) {
                            alert(e.message);
                        }

                       
                        var isPriceLocked = result.ispricelocked;
                        if (isPriceLocked != null) {
                            Xrm.Page.getAttribute("ispricelocked").setValue(isPriceLocked);
                        }

                        //currency
                        sourceFieldName = "transactioncurrencyid";
                        try {
                            if (result._transactioncurrencyid_value != null) {
                                var lookupValue = new Array();
                                lookupValue[0] = new Object();
                                lookupValue[0].id = result._transactioncurrencyid_value;
                                lookupValue[0].name = result["_transactioncurrencyid_value@OData.Community.Display.V1.FormattedValue"];
                                lookupValue[0].entityType = "transactioncurrency";
                                if (lookupValue[0].id != null) {
                                    Xrm.Page.getAttribute(sourceFieldName).setValue(lookupValue);
                                }
                            }
                        }
                        catch (e) {
                            alert(e.message);
                        }


                        //contact lookup vcalue
                        sourceFieldName = "customerid";
                        try {
                            if (result._customerid_value != null) {
                                var lookupValue = new Array();
                                lookupValue[0] = new Object();
                                lookupValue[0].id = result._customerid_value;
                                lookupValue[0].name = result["_customerid_value@OData.Community.Display.V1.FormattedValue"];
                                lookupValue[0].entityType = "contact";
                                if (lookupValue[0].id != null) {
                                    Xrm.Page.getAttribute(sourceFieldName).setValue(lookupValue);
                                }
                            }
                        }
                        catch (e) {
                            alert(e.message);
                        }

                        //club lookup value
                        sourceFieldName = "vtv_clubcode";
                        try {
                            if (result._vtv_clubcode_value != null) {
                                var lookupValue = new Array();
                                lookupValue[0] = new Object();
                                lookupValue[0].id = result._vtv_clubcode_value;
                                lookupValue[0].name = result["_vtv_clubcode_value@OData.Community.Display.V1.FormattedValue"];
                                lookupValue[0].entityType = "vtv_club";
                                if (lookupValue[0].id != null) {
                                    Xrm.Page.getAttribute(sourceFieldName).setValue(lookupValue);
                                }
                            }
                        }
                        catch (e) {
                            alert(e.message);
                        }
                         
                        //type of contact optionset value
                        var typeOfContact = result.vtv_typeofcontract;
                        if (typeOfContact != null) {
                            Xrm.Page.getAttribute("vtv_typeofcontract").setValue(typeOfContact);
                        }
                        
                        //type optionset value
                        var type = result.vtv_type;
                        if (type != null) {
                            Xrm.Page.getAttribute("vtv_type").setValue(type);
                        }

                        //membership term optionset value
                        var membershipTerm = result.vtv_membershipterm;
                        if (membershipTerm != null) {
                            Xrm.Page.getAttribute("vtv_membershipterm").setValue(membershipTerm);
                        }

                    },
                    error: function (xhr, textStatus, errorThrown) {
                        Xrm.Utility.alertDialog(textStatus + " " + errorThrown);
                    }
                });
            }
        }
    } else {

    }
}