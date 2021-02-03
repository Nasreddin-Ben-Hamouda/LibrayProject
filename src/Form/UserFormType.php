<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;

class UserFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('id',HiddenType::class,[
                'mapped'=>false,
                'attr'=>[
                    'autocomplete'=>'off'
                ]
            ])
            ->add('name',TextType::class,[
                'label'=>false,
                'constraints' => [
                    new NotBlank([
                        'message' => 'Le Nom et prénom est obligatoire',
                    ]),
                ],
                'attr' => [
                    'class'=>'form-control',
                    'autocomplete'=>'off',
                    'placeholder'=>'Nom et prénom'
                ]
            ])
            ->add('email',EmailType::class,[
                'label'=>false,
                'mapped'=>false,
                'constraints' => [
                    new NotBlank([
                        'message' => 'L\'email est obligatoire',
                    ]),
                ],
                'attr' => [
                    'class'=>'form-control',
                    'autocomplete'=>'off',
                    'placeholder'=>'Email'
                ]
            ])
            ->add('password', PasswordType::class, [
                'mapped'=>false,
                'label'=>false,
                'required'=>false,
                'constraints' => [
                    new Length([
                        'min' => 6,
                        'minMessage' => 'Le mot de passe doit être au moins 6 caractères',
                    ]),
                ],
                'attr' => [
                    'class'=>'form-control',
                    'autocomplete'=>'off',
                    'placeholder'=>'Mot de passe'
                ]

            ])
            ->add('phone',NumberType::class,[
                'label'=>false,
                'required'=>false,
                'invalid_message'=>'Le numéro de téléphone doit être numérique',
                'constraints' => [
                    new Length([
                        'min' => 8,
                        'minMessage' => 'Le numéro de téléphone doit être de 8 chiffres',
                        'max' =>8,
                        'maxMessage' =>'Le numéro de téléphone doit être de 8 chiffres'
                    ]),

                ],
                'attr' => [
                    'class'=>'form-control',
                    'autocomplete'=>'off',
                    'placeholder'=>'Téléphone'
                ]
            ])
            ->add('address', TextType::class,[
                'label'=>false,
                'required'=>false,
                'attr' => [
                    'class'=>'form-control',
                    'autocomplete'=>'off',
                    'placeholder'=>'Adresse'
                ]
            ])
            ->add('salary',NumberType::class,[
                'label'=>false,
                'required'=>false,
                'invalid_message'=>'Le salaire doit être numérique',
                'attr' => [
                    'class'=>'form-control',
                    'autocomplete'=>'off',
                    'placeholder'=>'Adresse'
                ]
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => User::class,
            'csrf_protection' => true,
            'csrf_field_name' => '_token',
            'csrf_token_id'   => 'user_item',
        ]);
    }
}
