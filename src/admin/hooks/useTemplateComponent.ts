import { TemplateProps } from "../templates/types";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getTemplate as newGetTemplate } from "../templates/registry";
import React from "react";

// TODO: rename to getTemplate

// TODO: create a new component that uses this hook to fetch the template component

export const useTemplateComponent = (
  templateId: "clean" | "classic" | "compact",
  props: TemplateProps,
): UseQueryResult<React.ReactElement, Error> => {
  return useQuery<React.ReactElement, Error>({
    queryKey: [
      "invoices-plugin-template-component",
      templateId,
      JSON.stringify(props),
    ],
    queryFn: async () => {
      const template = newGetTemplate(templateId);

      return template.render(props);
    },
  });
};
