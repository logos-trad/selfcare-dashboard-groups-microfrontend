import { User } from '@pagopa/selfcare-common-frontend/model/User';
import { InstitutionUserResource } from '../api/generated/b4f-dashboard/InstitutionUserResource';
import { ProductInfoResource } from '../api/generated/b4f-dashboard/ProductInfoResource';
import { ProductUserResource } from '../api/generated/b4f-dashboard/ProductUserResource';
import { UserRole, UserStatus } from './Party';
import { Product, ProductsMap } from './Product';

export type PartyUser = {
  id: string;
  taxCode: string;
  name: string;
  surname: string;
  email: string;
  userRole: UserRole;
  products: Array<PartyUserProduct>;
  status: UserStatus;
  isCurrentUser: boolean;
  certification: boolean;
};

export type PartyUserSimple = {
  id: string;
  name: string;
  surname: string;
};

export type PartyUserProduct = {
  id: string;
  title: string;
  roles: Array<PartyUserProductRole>;
};

export type PartyUserProductRole = {
  relationshipId: string;
  role: string;
  selcRole: UserRole;
  status: UserStatus;
};

export const institutionUserResource2PartyUser = (
  resource: InstitutionUserResource,
  productsMap: ProductsMap,
  currentUser: User
): PartyUser => ({
  id: resource.id,
  taxCode: resource.fiscalCode,
  name: resource.name,
  surname: resource.surname,
  email: resource.email,
  userRole: resource.role,
  products: ([] as Array<PartyUserProduct>).concat(
    resource.products.map((p) => productInfoResource2PartyUserProduct(p, productsMap[p.id]))
  ),
  status: resource.status as UserStatus,
  isCurrentUser: currentUser.uid === resource.id,
  certification: resource.certification,
});

export const productInfoResource2PartyUserProduct = (
  productInfo: ProductInfoResource,
  product: Product
): PartyUserProduct => ({
  id: productInfo.id,
  title: productInfo.title ?? product.title,
  roles: productInfo.roleInfos.map((r) => ({
    relationshipId: r.relationshipId,
    role: r.role,
    selcRole: r.selcRole as UserRole,
    status: r.status as UserStatus,
  })),
});

export const productUserResource2PartyUser = (
  resource: ProductUserResource,
  product: Product,
  currentUser: User
): PartyUser => ({
  id: resource.id,
  taxCode: resource.fiscalCode,
  name: resource.name,
  surname: resource.surname,
  email: resource.email,
  userRole: resource.role,
  products: [productInfoResource2PartyUserProduct(resource.product, product)],
  status: resource.status as UserStatus,
  isCurrentUser: currentUser.uid === resource.id,
  certification: resource.certification,
});