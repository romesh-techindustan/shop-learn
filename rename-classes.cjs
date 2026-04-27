const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// Read additional mappings
const additionalMappings = JSON.parse(fs.readFileSync(path.join(__dirname, 'mappings.json'), 'utf8'));

const mappings = {
  // App classes
  'app-shell': 'appLayoutWrapper',
  'app-shell__content': 'appMainContent',
  'app-shell__container': 'appContainer',

  // Navbar classes
  'navbar': 'navBar',
  'navbar__promo': 'topPromoBanner',
  'navbar__promo-inner': 'promoBannerContent',
  'navbar__promo-text': 'promoAnnouncementText',
  'navbar__text-link': 'promoShopNowLink',
  'navbar__language': 'languageSelector',
  'navbar__header': 'mainHeaderSection',
  'navbar__header-inner': 'headerContentWrapper',
  'navbar__brand': 'brandLogo',
  'navbar__nav': 'primaryNavLinks',
  'navbar__nav-link': 'navLinkItem',
  'navbar__nav-link--active': 'activeNavLink',
  'navbar__search': 'searchBarContainer',
  'navbar__tools': 'headerToolsGroup',
  'navbar__icon-group': 'userToolsGroup',
  'navbar__tool': 'toolIconButton',
  'navbar__tool--user': 'userAccountButton',
  'navbar__account-initials': 'userInitialsAvatar',
  'navbar__tool-badge': 'cartItemCountBadge',
  'navbar__user-menu': 'userDropdownMenu',
  'navbar__menu-item': 'dropdownMenuItem',
  'navbar__sr-only': 'visuallyHiddenText',

  // Footer classes
  'footer': 'pageFooter',
  'footer__container': 'appContainer', // reuse existing
  'footer__grid': 'footerLinksGrid',
  'footer__column': 'footerLinkColumn',
  'footer__brand': 'footerBrandSection',
  'footer__brand-title': 'footerBrandTitle',
  'footer__brand-desc': 'footerBrandDescription',
  'footer__subscribe': 'footerSubscribeForm',
  'footer__subscribe-input': 'footerEmailInput',
  'footer__subscribe-btn': 'footerSubscribeButton',
  'footer__title': 'footerColumnTitle',
  'footer__links': 'footerLinkList',
  'footer__links-item': 'footerLinkItem',
  'footer__bottom': 'footerBottomSection',
  'footer__copyright': 'footerCopyrightText',
  'footer__socials': 'footerSocialLinks',
  'footer__social-link': 'socialMediaLink',

  // ProductCard classes
  'home-product-card': 'productCardWrapper',
  'home-product-card__media': 'productImageContainer',
  'home-product-card__media--rose': 'productBgRose',
  'home-product-card__media--neon': 'productBgNeon',
  'home-product-card__media--ember': 'productBgEmber',
  'home-product-card__media--sand': 'productBgSand',
  'home-product-card__media--mint': 'productBgMint',
  'home-product-card__media--cocoa': 'productBgCocoa',
  'home-product-card__media--aqua': 'productBgAqua',
  'home-product-card__media--brass': 'productBgBrass',
  'home-product-card__media--slate': 'productBgSlate',
  'home-product-card__media--violet': 'productBgViolet',
  'home-product-card__media--citrus': 'productBgCitrus',
  'home-product-card__media--midnight': 'productBgMidnight',
  'home-product-card__media--noir': 'productBgNoir',
  'home-product-card__badge': 'productStatusBadge',
  'home-product-card__badge--new': 'productBadgeNew',
  'home-product-card__quick-actions': 'productQuickActions',
  'home-product-card__illustration': 'productIllustrationBox',
  'home-product-card__illustration--image': 'productIllustrationImage',
  'home-product-card__image': 'productMainImage',
  'home-product-card__cart': 'addToCartButton',
  'home-product-card__content': 'productDetailsSection',
  'home-product-card__price-row': 'productPriceRow',
  'home-product-card__price': 'productCurrentPrice',
  'home-product-card__price--old': 'productOldPrice',
  'home-rating': 'productRatingContainer',
  'home-rating__star-image': 'ratingStarIcon',
  'home-rating__count': 'ratingReviewCount',
  'home-product-card__swatches': 'productColorSwatches',
  'home-product-card__swatch': 'colorSwatchCircle',

  // Section classes (from HomePage)
  'home-section': 'pageSection',
  'home-section--no-bottom': 'sectionNoBottomMargin',
  'home-section-eyebrow': 'sectionEyebrowGroup',
  'home-section-eyebrow__box': 'eyebrowRedBox',
  'home-section-eyebrow__text': 'eyebrowLabelText',
  'home-section-header': 'sectionHeaderWrapper',
  'home-section-header__main': 'sectionHeaderTitleBox',
  'home-section-header__title': 'sectionMainTitle',
  'home-section-header__actions': 'sectionHeaderActions',
  'home-section-header__nav-btn': 'carouselNavButton',

  // Countdown classes
  'home-countdown': 'salesCountdownTimer',
  'home-countdown__item': 'countdownTimeBlock',
  'home-countdown__label': 'countdownTimeLabel',
  'home-countdown__value': 'countdownTimeValue',
  'home-countdown__separator': 'countdownSeparatorColon',

  // Hero section classes
  'home-hero': 'heroSectionWrapper',
  'home-hero__grid': 'heroGridLayout',
  'home-hero__nav': 'heroCategoryNav',
  'home-hero__nav-link': 'categoryNavLink',
  'home-hero__slider': 'heroSliderContainer',
  'home-hero__slide': 'heroSlideItem',
  'home-hero__slide-content': 'heroSlideContent',
  'home-hero__slide-eyebrow': 'heroSlideEyebrow',
  'home-hero__slide-eyebrow-icon': 'heroEyebrowIcon',
  'home-hero__slide-title': 'heroSlideTitle',
  'home-hero__slide-link': 'heroShopNowLink',
  'home-hero__slide-visual': 'heroSlideVisual',
  'home-hero__slide-image': 'heroProductImage',
  'home-hero__pagination': 'heroSliderPagination',
  'home-hero__dot': 'heroPaginationDot',
  'home-hero__dot--active': 'activePaginationDot',

  // HomePage lists
  'home-flash-sales__list': 'flashSalesList',
  'home-categories__grid': 'categoriesGridBox',
  'home-category-card': 'categoryCardBox',
  'home-category-card__icon': 'categoryIconWrapper',
  'home-category-card__title': 'categoryCardTitle',
  'home-products-grid': 'standardProductsGrid',
  'home-features': 'featuresSectionBox',
  'home-feature-card': 'featureCardItem',
  'home-feature-card__icon-wrap': 'featureIconWrapper',
  'home-feature-card__icon': 'featureIconInner',
  'home-feature-card__title': 'featureCardTitle',
  'home-feature-card__desc': 'featureCardDescription',
  'home-promo-banner': 'specialPromoBanner',
  'home-promo-banner__content': 'promoBannerTextContent',
  'home-promo-banner__eyebrow': 'promoBannerEyebrow',
  'home-promo-banner__title': 'promoBannerTitle',
  'home-promo-banner__countdown': 'promoBannerCountdown',
  'home-promo-banner__btn': 'promoBuyNowBtn',
  'home-promo-banner__visual': 'promoBannerVisuals',
  'home-promo-banner__image': 'promoBannerImage',

  // SignUp/Auth classes
  'auth-page': 'authPageWrapper',
  'auth-page__visual': 'authPageImageSide',
  'auth-page__image': 'authMainImage',
  'auth-page__content': 'authFormContainerSide',
  'auth-page__form-box': 'authFormWrapper',
  'auth-page__title': 'authFormTitle',
  'auth-page__subtitle': 'authFormSubtitle',
  'auth-form': 'authenticationForm',
  'auth-form__group': 'inputFieldGroup',
  'auth-form__input': 'textInputBox',
  'auth-form__actions': 'formActionsGroup',
  'auth-form__submit': 'primarySubmitButton',
  'auth-form__google': 'googleLoginButton',
  'auth-form__google-icon': 'googleIconImg',
  'auth-form__forgot': 'forgotPasswordLink',
  'auth-form__footer': 'authFormFooterText',
  'auth-form__link': 'authFormFooterLink',

  // ProductsPage classes
  'products-page': 'catalogPageWrapper',
  'products-page__header': 'catalogPageHeader',
  'products-page__title': 'catalogPageTitle',
  'products-page__layout': 'catalogLayoutGrid',
  'products-page__sidebar': 'catalogFiltersSidebar',
  'products-page__grid': 'catalogProductsGrid',
  'filter-group': 'filterSectionGroup',
  'filter-group__title': 'filterSectionTitle',
  'filter-group__list': 'filterCheckboxList',
  'filter-group__item': 'filterCheckboxItem',
  'filter-group__item-label': 'filterCheckboxLabel',

  // Commerce Pages (Cart, Checkout, etc.)
  'commerce-page': 'ecommercePageWrapper',
  'commerce-page__header': 'ecommercePageHeader',
  'commerce-page__title': 'ecommercePageTitle',
  'commerce-page__empty': 'emptyStateContainer',
  'commerce-page__empty-icon': 'emptyStateIcon',
  'commerce-page__empty-title': 'emptyStateTitle',
  'commerce-page__empty-desc': 'emptyStateDescription',
  'commerce-btn': 'standardPrimaryButton',
  'commerce-btn--outline': 'standardOutlineButton',
  
  // Cart Page
  'cart-layout': 'cartPageLayout',
  'cart-table-wrapper': 'cartTableScrollWrapper',
  'cart-table': 'shoppingCartTable',
  'cart-table__product': 'cartProductCell',
  'cart-table__image': 'cartProductImage',
  'cart-table__name': 'cartProductName',
  'cart-table__qty': 'cartQuantitySelector',
  'cart-table__qty-btn': 'cartQtyAdjustButton',
  'cart-table__qty-val': 'cartQtyValue',
  'cart-table__remove': 'cartRemoveItemBtn',
  'cart-actions': 'cartActionsRow',
  'cart-summary-wrapper': 'cartSummarySection',
  'cart-coupon': 'cartCouponBox',
  'cart-coupon__input': 'couponCodeInput',
  'cart-coupon__btn': 'applyCouponButton',
  'cart-totals': 'cartTotalsBox',
  'cart-totals__title': 'cartTotalsTitle',
  'cart-totals__row': 'cartTotalRow',
  'cart-totals__row--final': 'cartFinalTotalRow',
  'cart-totals__btn': 'proceedCheckoutButton',

  // Checkout Page
  'checkout-layout': 'checkoutPageLayout',
  'checkout-form': 'checkoutDetailsForm',
  'checkout-form__title': 'checkoutFormTitle',
  'checkout-form__grid': 'checkoutFieldsGrid',
  'checkout-form__group': 'checkoutFormGroup',
  'checkout-form__group--full': 'checkoutFormGroupFullWidth',
  'checkout-form__label': 'checkoutFieldLabel',
  'checkout-form__input': 'checkoutInputField',
  'checkout-form__checkbox': 'checkoutCheckboxRow',
  'checkout-summary': 'checkoutOrderSummaryBox',
  'checkout-summary__items': 'checkoutItemsList',
  'checkout-summary__item': 'checkoutItemRow',
  'checkout-summary__item-info': 'checkoutItemDetails',
  'checkout-summary__item-image': 'checkoutItemImage',
  'checkout-summary__item-name': 'checkoutItemName',
  'checkout-summary__item-price': 'checkoutItemPrice',
  'checkout-summary__totals': 'checkoutTotalsSection',
  'checkout-summary__row': 'checkoutTotalRow',
  'checkout-summary__row--final': 'checkoutFinalTotalRow',
  'checkout-summary__payment': 'checkoutPaymentMethods',
  'checkout-payment-option': 'paymentOptionRow',
  'checkout-payment-option__banks': 'paymentBankIconsList',
  'checkout-payment-option__bank': 'paymentBankIcon',
  'checkout-summary__btn': 'placeOrderButton',

  // Account/Orders
  'account-layout': 'userProfileLayout',
  'account-sidebar': 'profileNavigationSidebar',
  'account-sidebar__title': 'profileSidebarTitle',
  'account-sidebar__list': 'profileSidebarList',
  'account-sidebar__link': 'profileSidebarLink',
  'account-sidebar__link--active': 'activeProfileSidebarLink',
  'account-content': 'profileMainContentArea',
  'account-form': 'profileEditForm',
  'account-form__title': 'profileEditFormTitle',
  'account-form__grid': 'profileFormGrid',
  'account-form__group': 'profileFormGroup',
  'account-form__label': 'profileFieldLabel',
  'account-form__input': 'profileInputField',
  'account-form__actions': 'profileFormActions',
  'orders-list': 'orderHistoryList',
  'order-card': 'historyOrderCard',
  'order-card__header': 'orderCardHeader',
  'order-card__id': 'orderCardIdNumber',
  'order-card__date': 'orderCardDate',
  'order-card__status': 'orderCardStatusBadge',
  'order-card__status--delivered': 'orderStatusDelivered',
  'order-card__status--processing': 'orderStatusProcessing',
  'order-card__status--cancelled': 'orderStatusCancelled',
  'order-card__items': 'orderCardItemsList',
  'order-card__item': 'orderCardSingleItem',
  'order-card__item-image': 'orderItemThumbnail',
  'order-card__item-name': 'orderItemName',
  'order-card__item-qty': 'orderItemQuantity',
  'order-card__item-price': 'orderItemPrice',
  'order-card__footer': 'orderCardFooter',
  'order-card__total': 'orderCardTotalAmount',

  // Additional modifiers
  'is-muted': 'isMutedState',
  
  ...additionalMappings
};

// Sort mappings by length descending so longer class names are replaced first
const sortedKeys = Object.keys(mappings).sort((a, b) => b.length - a.length);

function walkSync(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.css') || dirFile.endsWith('.jsx')) {
        filelist.push(dirFile);
      }
    }
  }
  return filelist;
}

const files = walkSync(srcDir);

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  if (file.endsWith('.css')) {
    for (const key of sortedKeys) {
      const regex = new RegExp(`\\.${key}(?![a-zA-Z0-9_-])`, 'g');
      content = content.replace(regex, `.${mappings[key]}`);
    }
  } else if (file.endsWith('.jsx')) {
    for (const key of sortedKeys) {
      const regex = new RegExp(`(?<=[\\s"'\\\`]|^)${key}(?=[\\s"'\\\`]|$)`, 'g');
      content = content.replace(regex, mappings[key]);
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
console.log('Class renaming complete.');
