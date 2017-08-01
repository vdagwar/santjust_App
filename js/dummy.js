$(document).ready(function () {
    var entity = {};
    entity.new_startdate = "3/9/2017";
    entity.new_enddate = "4/20/2017";
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
            searchable: true,
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
        $("#export").css("height", "20px");
        $("#export").css("margin-left", "0.5%");
    }


});

function PublishProductOnApprovedStatus() {
    var _Id = window.parent.Xrm.Page.data.entity.getId();
    var Status = window.parent.Xrm.Page.getAttribute("vtv_status").getValue();
    if (Status == 100000002) {
        var _state = {};
        _state.statecode = 0;
        $.ajax({
            type: "PATCH",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            url: Xrm.Page.context.getClientUrl() + "/api/data/v8.2/products("+_Id+")",
            data: JSON.stringify(_state),
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("OData-MaxVersion", "4.0");
                XMLHttpRequest.setRequestHeader("OData-Version", "4.0");
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            async: true,
            success: function (data, textStatus, xhr) {
                // sucessfully published
            },
            error: function (xhr, textStatus, errorThrown) {
                //error in publishing the product
            }
        });
    }
}




var recordId = window.parent.Xrm.Page.data.entity.getId();
debugger;
if (recordId == "") {
    var guestReferralId = window.parent.Xrm.Page.getAttribute("vtv_opportunityguestreferral").getValue();
    var req = new XMLHttpRequest();
    req.open("GET", windo.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.2/opportunities(" + guestReferralId + ")", true);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 200) {
                var result = JSON.parse(this.response);
                var _customerid_value = result["_customerid_value"];
                var _customerid_value_formatted = result["_customerid_value@OData.Community.Display.V1.FormattedValue"];
                var _customerid_value_lookuplogicalname = result["_customerid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                var _vtv_brandid_value = result["_vtv_brandid_value"];
                var _vtv_brandid_value_formatted = result["_vtv_brandid_value@OData.Community.Display.V1.FormattedValue"];
                var _vtv_brandid_value_lookuplogicalname = result["_vtv_brandid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                var _vtv_clubid_value = result["_vtv_clubid_value"];
                var _vtv_clubid_value_formatted = result["_vtv_clubid_value@OData.Community.Display.V1.FormattedValue"];
                var _vtv_clubid_value_lookuplogicalname = result["_vtv_clubid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                var vtv_guestshow = result["vtv_guestshow"];
                var vtv_guestshow_formatted = result["vtv_guestshow@OData.Community.Display.V1.FormattedValue"];
                var _vtv_opportunityguestreferral_value = result["_vtv_opportunityguestreferral_value"];
                var _vtv_opportunityguestreferral_value_formatted = result["_vtv_opportunityguestreferral_value@OData.Community.Display.V1.FormattedValue"];
                var _vtv_opportunityguestreferral_value_lookuplogicalname = result["_vtv_opportunityguestreferral_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                var vtv_type = result["vtv_type"];
                var vtv_type_formatted = result["vtv_type@OData.Community.Display.V1.FormattedValue"];

                var sourceFieldName = "vtv_brandid";
                try {
                    if (result._vtv_brandid_value != null) {
                        var lookupValue = new Array();
                        lookupValue[0] = new Object();
                        lookupValue[0].id = result._vtv_brandid_value;
                        lookupValue[0].name = result._vtv_brandid_value_formatted;
                        lookupValue[0].entityType = "vtv_brand";
                        if (lookupValue[0].id != null) {
                            Xrm.Page.getAttribute(sourceFieldName).setValue(lookupValue);
                        }
                    }
                }
                catch (e) {
                    alert(e.message);
                }

                var sourceFieldName = "vtv_clubid";
                try {
                    if (result._vtv_clubid_value != null) {
                        var lookupValue = new Array();
                        lookupValue[0] = new Object();
                        lookupValue[0].id = result._vtv_clubid_value;
                        lookupValue[0].name = result._vtv_clubid_value_formatted;
                        lookupValue[0].entityType = "vtv_club";
                        if (lookupValue[0].id != null) {
                            Xrm.Page.getAttribute(sourceFieldName).setValue(lookupValue);
                        }
                    }
                }
                catch (e) {
                    alert(e.message);
                }

                var sourceFieldName = "customerid";
                try {
                    if (result._customerid_value != null) {
                        var lookupValue = new Array();
                        lookupValue[0] = new Object();
                        lookupValue[0].id = result._customerid_value;
                        lookupValue[0].name = result._customerid_value_formatted;
                        lookupValue[0].entityType = "contact";
                        if (lookupValue[0].id != null) {
                            Xrm.Page.getAttribute(sourceFieldName).setValue(lookupValue);
                        }
                    }
                }
                catch (e) {
                    alert(e.message);
                }


                debugger;
                if (result.vtv_type != null) {
                    Xrm.Page.getAttribute("vtv_type").setValue(result.vtv_type);
                }

            } else {
                Xrm.Utility.alertDialog(this.statusText);
            }
        }
    };
    req.send();
}
