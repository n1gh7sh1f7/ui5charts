using {db} from '../db/schema';

service Catalog {
    entity Resource      as projection on db.Resource;
    entity Yard          as projection on db.Yard;
    entity Site          as projection on db.Site;
    entity Stock         as projection on db.Stock;
    entity Country       as projection on db.Country;
    entity City          as projection on db.City;
    entity Address       as projection on db.Address;
    entity ResourceStock as projection on db.ResourceStock;
}
