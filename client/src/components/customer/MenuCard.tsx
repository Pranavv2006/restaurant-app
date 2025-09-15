import React from "react";

type MenuCardProps = {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
};

const MenuCard: React.FC<MenuCardProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  primaryAction,
  secondaryAction,
}) => {
  return (
    <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
      {/* Image */}
      <div className="h-52 flex justify-center items-center rounded-t-xl overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        <span className="block mb-1 text-xs font-semibold uppercase text-blue-600 dark:text-blue-500">
          {subtitle}
        </span>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-300 group-hover:text-blue-600 dark:group-hover:text-white">
          {title}
        </h3>
        <p className="mt-3 text-gray-500 dark:text-neutral-500">
          {description}
        </p>
      </div>

      {/* Actions */}
      {(primaryAction || secondaryAction) && (
        <div className="mt-auto flex border-t border-gray-200 divide-x divide-gray-200 dark:border-neutral-700 dark:divide-neutral-700">
          {primaryAction && (
            <a
              href={primaryAction.href}
              className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-es-xl bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            >
              {primaryAction.label}
            </a>
          )}
          {secondaryAction && (
            <a
              href={secondaryAction.href}
              className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-xl bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            >
              {secondaryAction.label}
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuCard;
