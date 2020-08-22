namespace db;

entity Resource {
    key id     : UUID;
        name   : String(128);
        type   : String(32);
        yardId : String(36);
        siteId : String(36);
        stock  : Association to one Stock
                     on  stock.resourceId = id
                     and stock.yardId     = yardId;
        yard   : Association to one Yard
                     on yard.id = yardId;
        site   : Association to one Site
                     on site.id = siteId;
}

entity Yard {
    key id   : UUID;
        name : String(128);
}

entity Site {
    key id   : UUID;
        name : String(128);
}

entity Stock {
    key yardId     : String(36);
    key resourceId : String(36);
        quantity   : Integer;
        yard       : Association to one Yard
                         on yard.id = yardId;
        resource   : Association to one Resource
                         on resource.id = resourceId;
}

entity Country {
    key id   : String(4);
        name : String(64);
}

entity City {
    key id        : String(4);
    key countryId : String(4);
        name      : String(64);
        country   : Association to one Country
                        on country.id = countryId;
}

entity Address {
    key id        : UUID;
        countryId : String(4);
        cityId    : String(4);
        street    : String(128);
        streetNo  : Integer;
        postCode  : String(32);
}

view ResourceStock as
    select from Resource {
        key id             as resourceId,
            name           as resourceName,
            yard.id        as yardId,
            yard.name      as yardName,
            type           as resourceType,
            stock.quantity as quantity
    };
